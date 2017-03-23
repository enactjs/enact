/**
 * Exports the {@link spotlight/Spottable.Spottable} Higher-order Component and
 * the {@link spotlight/Spottable.spottableClass} `className`. The default export is
 * {@link spotlight/Spottable.Spottable}.
 *
 * @module spotlight/Spottable
 */

import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {is} from '@enact/core/keymap';
import pick from 'ramda/src/pick';
import React from 'react';

import Spotlight from '../src/spotlight';

/**
 * The class name for spottable components. In general, you do not need to directly access this class
 *
 * @memberof spotlight/Spottable
 * @public
 */
const spottableClass = 'spottable';
const spottableDisabledClass = 'spottableDisabled';

const ENTER_KEY = 13;
const REMOTE_OK_KEY = 16777221;

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

const shouldEmulateMouse = (ev) => {
	const {which, type, currentTarget} = ev;
	return (
		// emulate mouse events for any remote okay button event
		which === REMOTE_OK_KEY ||
		// or a non-keypress enter event or any enter event on a non-keyboard accessible control
			(which === ENTER_KEY && (type !== 'keypress' || !isKeyboardAccessible(currentTarget)))
	);
};

const forwardEnter = (keyEvent, mouseEvent) => (props) => {
	const keyHandler = props[keyEvent];
	const mouseHandler = props[mouseEvent];
	return (ev) => {
		if (keyHandler) keyHandler(ev);
		if (mouseHandler && !ev.repeat && shouldEmulateMouse(ev)) mouseHandler(ev);
	};
};

const keyDownEventProps = ['altKey', 'ctrlKey', 'currentTarget', 'detail', 'key', 'keyCode',
	'metaKey', 'shiftKey', 'target', 'type', 'which'];

const makeEvent = (type, ev) => {
	return {...ev, type};
};

/**
 * Default configuration for Spottable
 *
 * @hocconfig
 * @memberof spotlight/Spottable.Spottable
 */
const defaultConfig = {
	/**
	 * Whether or not the component should emulate mouse events as a response
	 * to Spotlight 5-way events.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 * @memberof spotlight/Spottable.Spottable.defaultConfig
	 */
	emulateMouse: true,

	/**
	 * Number of milliseconds to wait before forwarding a `keyup` event, due to
	 * focus changing from an unreleased `keydown` event.
	 *
	 * @type {Number}
	 * @default 0
	 * @public
	 * @memberof spotlight/Spottable.Spottable.defaultConfig
	 */
	selectionKeyUpDelay: 0
};

/**
 * Constructs a Spotlight 5-way navigation-enabled Higher-order Component.
 *
 * @example
 *	const SpottableComponent = Spottable(Component);
 *
 * @class Spottable
 * @memberof spotlight/Spottable
 * @param  {Object} defaultConfig Set of default configuration parameters
 * @param  {Function} Wrapped Component to wrap
 *
 * @hoc
 * @returns {Function} Spottable
 */
const Spottable = hoc(defaultConfig, (config, Wrapped) => {
	const {emulateMouse, selectionKeyUpDelay} = config;
	const forwardBlur = forward('onBlur');
	const forwardFocus = forward('onFocus');
	const forwardEnterKeyPress = forwardEnter('onKeyPress', 'onClick');
	const forwardEnterKeyDown = forwardEnter('onKeyDown', 'onMouseDown');
	const forwardEnterKeyUp = forwardEnter('onKeyUp', 'onMouseUp');
	const forwardKeyDown = forward('onKeyDown');
	const forwardKeyUp = forward('onKeyUp');

	return class extends React.Component {
		static displayName = 'Spottable'

		static propTypes = /** @lends spotlight/Spottable.Spottable.prototype */ {
			/**
			 * Whether or not the component is in a disabled state.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			disabled: React.PropTypes.bool,

			/**
			 * The handler to run when the component is removed while retaining focus.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onSpotlightDisappear: React.PropTypes.func,

			/**
			 * The handler to run when the 5-way down key is pressed.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onSpotlightDown: React.PropTypes.func,

			/**
			 * The handler to run when the 5-way left key is pressed.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onSpotlightLeft: React.PropTypes.func,

			/**
			 * The handler to run when the 5-way right key is pressed.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onSpotlightRight: React.PropTypes.func,

			/**
			 * The handler to run when the 5-way up key is pressed.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onSpotlightUp: React.PropTypes.func,

			/**
			 * When `true`, the component cannot be navigated using spotlight.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			spotlightDisabled: React.PropTypes.bool,

			/**
			 * The tabIndex of the component. This value will default to -1 if left
			 * unset and the control is spottable.
			 *
			 * @type {Number}
			 * @public
			 */
			tabIndex: React.PropTypes.number
		}

		constructor (props) {
			super(props);
			this.enterKeyDownEvent = null;
			this.state = {
				spotted: false
			};
		}

		componentDidUpdate (prevProps, prevState) {
			// if a blur occured during a enter-key press/hold, as a result of a programmatic focus change
			if (prevState.spotted && !this.state.spotted && this.enterKeyDownEvent) {
				// Certain components require time to perform an action (animation via an applied class) due to
				// forwarding a `keydown` event, while being selected. Immediately calling `forwardEnterKeyUp`
				// will result in the components being updated too quickly for the animation to begin, providing
				// no visual feedback of the selection. We perform this behavior in the `componentDidUpdate`
				// life-cycle instead of immediately within the `onBlur` event to ensure the component tree has
				// been updated, giving us the full `selectionKeyUpDelay` time to work with.
				setTimeout(() => {
					forwardEnterKeyUp(this.props)(makeEvent('onKeyUp', this.enterKeyDownEvent));
					this.enterKeyDownEvent = null;
				}, selectionKeyUpDelay);
			}
		}

		componentWillUnmount () {
			const {onSpotlightDisappear} = this.props;

			if (this.state.spotted && onSpotlightDisappear) {
				onSpotlightDisappear();
			}
		}

		onBlur = (e) => {
			if (e.currentTarget === e.target) {
				this.setState({spotted: false});
			}

			if (Spotlight.isMuted(e.target)) {
				e.stopPropagation();
			} else {
				forwardBlur(e, this.props);
			}
		}

		onFocus = (e) => {
			if (e.currentTarget === e.target) {
				this.setState({spotted: true});
			}

			if (Spotlight.isMuted(e.target)) {
				e.stopPropagation();
			} else {
				forwardFocus(e, this.props);
			}
		}

		onKeyDown = (e) => {
			const {disabled, onSpotlightDown, onSpotlightLeft, onSpotlightRight, onSpotlightUp} = this.props;
			const keyCode = e.keyCode;

			if (onSpotlightDown && is('down', keyCode)) {
				onSpotlightDown(e);
			} else if (onSpotlightLeft && is('left', keyCode)) {
				onSpotlightLeft(e);
			} else if (onSpotlightRight && is('right', keyCode)) {
				onSpotlightRight(e);
			} else if (onSpotlightUp && is('up', keyCode)) {
				onSpotlightUp(e);
			}

			if (emulateMouse && !(this.state.spotted && disabled) && is('enter', keyCode)) {
				this.enterKeyDownEvent = pick(keyDownEventProps, e);
				forwardEnterKeyDown(this.props)(e);
			} else {
				forwardKeyDown(e, this.props);
			}
		}

		onKeyUp = (e) => {
			if (emulateMouse && !(this.state.spotted && this.props.disabled) && is('enter', e.keyCode)) {
				this.enterKeyDownEvent = null;
				forwardEnterKeyUp(this.props)(e);
			} else {
				forwardKeyUp(e, this.props);
			}
		}

		render () {
			const {disabled, spotlightDisabled, ...rest} = this.props;
			const spottableDisabled = this.state.spotted && disabled;
			const spottable = (spottableDisabled || !disabled) && !spotlightDisabled;
			const classes = spottableDisabled ? spottableClass + ' ' + spottableDisabledClass : spottableClass;
			const componentDisabled = !spottable && disabled;
			let tabIndex = rest.tabIndex;

			delete rest.onSpotlightDisappear;
			delete rest.onSpotlightDown;
			delete rest.onSpotlightLeft;
			delete rest.onSpotlightRight;
			delete rest.onSpotlightUp;

			if (tabIndex == null && spottable) {
				tabIndex = -1;
			}

			if (spottable) {
				rest['onBlur'] = this.onBlur;
				rest['onFocus'] = this.onFocus;
				rest['onKeyDown'] = this.onKeyDown;
				rest['onKeyUp'] = this.onKeyUp;

				if (emulateMouse && !spottableDisabled) {
					rest['onKeyPress'] = forwardEnterKeyPress(this.props);
				}
				if (rest.className) {
					rest.className += ' ' + classes;
				} else {
					rest.className = classes;
				}
			}

			return (
				<Wrapped
					{...rest}
					disabled={componentDisabled}
					tabIndex={tabIndex}
				/>
			);
		}
	};
});

export default Spottable;
export {Spottable, spottableClass};
