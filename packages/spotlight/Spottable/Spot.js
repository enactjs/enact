import {forward, forwardWithPrevent, handle, preventDefault, stop} from '@enact/core/handle';
import {is} from '@enact/core/keymap';

import {getContainersForNode} from '../src/container';
import {hasPointerMoved} from '../src/pointer';
import {getDirection, Spotlight} from '../src/spotlight';

// const ENTER_KEY = 13;
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

const isSpottable = (props) => !props.spotlightDisabled;

// Last instance of spottable to be focused
let lastSelectTarget = null;
// Should we prevent select being passed through
let selectCancelled = false;

class Spot {
    constructor ({emulateMouse, ...props}) {
        this.props = props;
        this.context = {emulateMouse};

        this.isHovered = false;
        // Used to indicate that we want to stop propagation on blur events that occur as a
        // result of this component imperatively blurring itself on focus when spotlightDisabled
        this.shouldPreventBlur = false;
        this.isFocused = false;
        this.focusedWhenDisabled = false;
    }

    componentDidMount (node) {
        this.node = node;
    }

    componentDidUpdate (prevProps) {
        this.isFocused = this.node && Spotlight.getCurrent() === this.node;

        // if the component is focused and became disabled
        if (this.isFocused && this.props.disabled && lastSelectTarget === this && !selectCancelled) {
            selectCancelled = true;
            forward('onMouseUp', null, this.props);
        }

        // if the component became enabled, notify spotlight to enable restoring "lost" focus
        if (isSpottable(this.props) && !isSpottable(prevProps) && !Spotlight.isPaused()) {
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
    }

    componentWillUnmount () {
        if (this.isFocused) {
            forward('onSpotlightDisappear', null, this.props);
        }
        if (lastSelectTarget === this) {
            lastSelectTarget = null;
        }
    }

    shouldEmulateMouse = (ev, props) => {
        if (!this.context.emulateMouse) {
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
    }

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
    }

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
    }

    forwardAndResetLastSelectTarget = (ev, props) => {
        const {keyCode} = ev;
        const {selectionKeys} = props;
        const key = selectionKeys.find((value) => keyCode === value);
        const notPrevented = forwardWithPrevent('onKeyUp', ev, props);

        // bail early for non-selection keyup to avoid clearing lastSelectTarget prematurely
        if (!key && (!is('enter', keyCode) || !getDirection(keyCode))) {
            return notPrevented;
        }

        const allow = lastSelectTarget === this;
        selectCancelled = false;
        lastSelectTarget = null;
        return notPrevented && allow;
    }

    isActionable = (ev, props) => isSpottable(props)

    handle = handle.bind(this)

    handleKeyDown = this.handle(
        forwardWithPrevent('onKeyDown'),
        this.forwardSpotlightEvents,
        this.isActionable,
        this.handleSelect,
        this.shouldEmulateMouse,
        forward('onMouseDown')
    )

    handleKeyUp = this.handle(
        this.forwardAndResetLastSelectTarget,
        this.isActionable,
        this.shouldEmulateMouse,
        forward('onMouseUp'),
        forward('onClick')
    )

    handleBlur = (ev) => {
        if (this.shouldPreventBlur) return;
        if (ev.currentTarget === ev.target) {
            this.isFocused = false;
            if (this.focusedWhenDisabled) {
                this.focusedWhenDisabled = false;
                // We only need to trigger a rerender if a focused item becomes disabled and still needs its focus.
                // Once it blurs we need to rerender to remove the spottable class so it will not spot again.
                // The reason we don't use state is for performance reasons to avoid updates.
                this.forceUpdate();
            }
        }

        if (Spotlight.isMuted(ev.target)) {
            ev.stopPropagation();
        } else {
            forward('onBlur', ev, this.props);
        }
    }

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
        } else {
            forward('onFocus', ev, this.props);
        }
    }

    handleEnter = (ev) => {
        forward('onMouseEnter', ev, this.props);
        if (hasPointerMoved(ev.clientX, ev.clientY)) {
            this.isHovered = true;
        }
    }

    handleLeave = (ev) => {
        forward('onMouseLeave', ev, this.props);
        if (hasPointerMoved(ev.clientX, ev.clientY)) {
            this.isHovered = false;
        }
    }

    render ({spotlightDisabled}) {
        this.focusedWhenDisabled = this.isFocused && spotlightDisabled;
    }
}

export default Spot;
export {
    Spot
};
