import {forward, handle, preventDefault, stop} from '@enact/core/handle';
import {is} from '@enact/core/keymap';

import {getContainersForNode} from '../src/container';
import {getDirection, Spotlight} from '../src/spotlight';

const REMOTE_OK_KEY = 16777221;

/**
 * The class name for spottable components. In general, you do not need to directly access this class
 *
 * @memberof spotlight/Spottable
 * @public
 */
const spottableClass = 'spottable';

const isKeyboardAccessible = (node) => {
	if (!node) return false;
	const name = node.nodeName.toUpperCase();
	const type = node.type ? node.type.toUpperCase() : null;
	return (
		name === 'BUTTON' ||
		name === 'A' ||
		name === 'INPUT' && (
			type === 'BUTTON' ||
			type === 'CHECKBOX' ||
			type === 'IMAGE' ||
			type === 'RADIO' ||
			type === 'RESET' ||
			type === 'SUBMIT'
		)
	);
};

const isSpottable = (props) => !props.spotlightDisabled;

// Last instance of spottable to be focused
let lastSelectTarget = null;

// Should we prevent select being passed through
let selectCancelled = false;

class Spot {
	constructor ({emulateMouse, useForceUpdate}) {
		this.config = {
			emulateMouse,
			useForceUpdate
		};
		this.props = {};
		this.context = {};

		this.isFocused = false;
		this.isFocusedWhenDisabled = false;
		this.isHovered = false;
		this.spottableClass = null;
		// Used to indicate that we want to stop propagation on blur events that occur as a
		// result of this component imperatively blurring itself on focus when spotlightDisabled
		this.shouldPreventBlur = false;
	}

	setPropsAndContext (props, context) {
		this.props = props;
		this.context.prevSpotlightDisabled = context.prevSpotlightDisabled;

		this.isFocusedWhenDisabled = this.isFocused && props.spotlightDisabled;
		this.spottableClass = (this.isFocusedWhenDisabled || isSpottable(props)) ? spottableClass : null;
	}

	load (node = null) {
		this.node = node;
	}

	unload () {
		if (this.isFocused) {
			forward('onSpotlightDisappear', null, this.props);
		}
		if (lastSelectTarget === this) {
			lastSelectTarget = null;
		}
	}

	didUpdate = () => {
		this.isFocused = this.node && this.node === Spotlight.getCurrent();

		// if the component is focused and became disabled
		if (this.isFocused && this.props.disabled && lastSelectTarget === this && !selectCancelled) {
			selectCancelled = true;
			forward('onSelectionCancel', null, this.props);
		}

		// if the component became enabled, notify spotlight to enable restoring "lost" focus
		if (isSpottable(this.props) && this.context.prevSpotlightDisabled && !Spotlight.isPaused()) {
			if (Spotlight.getPointerMode()) {
				if (this.isHovered) {
					Spotlight.setPointerMode(false);
					Spotlight.focus(this.node);
					Spotlight.setPointerMode(true);
				}
			} else if (!Spotlight.getCurrent()) {
				const containers = getContainersForNode(this.node);
				const containerId = Spotlight.getActiveContainer();
				if (containers.indexOf(containerId) >= 0) {
					Spotlight.focus(containerId);
				}
			}
		}
	};

	forwardSpotlightEvents = (ev, {onSpotlightDown, onSpotlightLeft, onSpotlightRight, onSpotlightUp}) => {
		const {keyCode} = ev;

		if (onSpotlightDown && is('down', keyCode)) {
			onSpotlightDown(ev);
		} else if (onSpotlightLeft && is('left', keyCode)) {
			onSpotlightLeft(ev);
		} else if (onSpotlightRight && is('right', keyCode)) {
			onSpotlightRight(ev);
		} else if (onSpotlightUp && is('up', keyCode)) {
			onSpotlightUp(ev);
		}

		return true;
	};

	forwardAndResetLastSelectTarget = (ev, props) => {
		const {keyCode} = ev;
		const {selectionKeys} = props;
		const key = selectionKeys.find((value) => keyCode === value);
		const notPrevented = !ev.defaultPrevented;

		// bail early for non-selection keyup to avoid clearing lastSelectTarget prematurely
		if (!key && (!is('enter', keyCode) || !getDirection(keyCode))) {
			return notPrevented;
		}

		const allow = lastSelectTarget === this;
		selectCancelled = false;
		lastSelectTarget = null;
		return notPrevented && allow;
	};

	shouldEmulateMouse = (ev, props) => {
		if (!this.config.emulateMouse) {
			return;
		}

		const {currentTarget, repeat, type, which} = ev;
		const {selectionKeys} = props;
		const keyboardAccessible = isKeyboardAccessible(currentTarget);

		const keyCode = selectionKeys.find((value) => (
			// emulate mouse events for any remote okay button event
			which === REMOTE_OK_KEY ||
			// or a non-keypress selection event or any selection event on a non-keyboard accessible
			// control
			(
				which === value &&
				(type !== 'keypress' || !keyboardAccessible)
			)
		));

		if (getDirection(keyCode)) {
			preventDefault(ev);
			stop(ev);
		} else if (keyCode && keyboardAccessible) {
			preventDefault(ev);
		}

		return keyCode && !repeat;
	};

	isActionable = (ev, props) => isSpottable(props);

	handleSelect = ({which}, props) => {
		const {selectionKeys} = props;

		// Only apply accelerator if handling a selection key
		if (selectionKeys.find((value) => which === value)) {
			if (selectCancelled || (lastSelectTarget && lastSelectTarget !== this)) {
				return false;
			}
			lastSelectTarget = this;
		}
		return true;
	};

	handle = handle.bind(this);

	handleKeyDown = this.handle(
		(ev) => !ev.defaultPrevented,
		this.forwardSpotlightEvents,
		this.isActionable,
		this.handleSelect,
		this.shouldEmulateMouse
		// `forwardMouseDown` is usually called out of the useSpot if the `this.shouldEmulateMouse` returns true.
	);

	handleKeyUp = this.handle(
		this.forwardAndResetLastSelectTarget,
		this.isActionable,
		this.shouldEmulateMouse
		// `forwardMouseUp` and `forwardClick` are usually called out of the useSpot if the `this.shouldEmulateMouse` returns true.
	);

	handleFocus = (ev) => {
		if (this.props.spotlightDisabled) {
			this.shouldPreventBlur = true;
			ev.target.blur();
			this.shouldPreventBlur = false;
			return;
		}

		if (ev.currentTarget === ev.target) {
			this.isFocused = true;
		}

		if (Spotlight.isMuted(ev.target)) {
			ev.stopPropagation();
			return false;
		}

		return true;
	};

	handleBlur = (ev) => {
		if (this.shouldPreventBlur) return false;

		if (ev.currentTarget === ev.target) {
			this.isFocused = false;
			if (this.isFocusedWhenDisabled) {
				this.isFocusedWhenDisabled = false;
				// We only need to trigger a rerender if a focused item becomes disabled and still needs its focus.
				// Once it blurs we need to rerender to remove the spottable class so it will not spot again.
				// The reason we don't use state is for performance reasons to avoid updates.
				this.config.useForceUpdate();
			}
		}

		if (Spotlight.isMuted(ev.target)) {
			ev.stopPropagation();
			return false;
		}

		return true;
	};

	handleEnter = () => {
		this.isHovered = true;
	};

	handleLeave = () => {
		this.isHovered = false;
	};
}

export default Spot;
export {
	Spot,
	spottableClass
};
