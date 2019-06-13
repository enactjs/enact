import {call, forward, forwardWithPrevent, handle, stopImmediate} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {is} from '@enact/core/keymap';
import {getDirection, Spotlight} from '@enact/spotlight';
import Pause from '@enact/spotlight/Pause';
import Spottable from '@enact/spotlight/Spottable';
import PropTypes from 'prop-types';
import React from 'react';

import {lockPointer, releasePointer} from './pointer';

const isBubbling = (ev) => ev.currentTarget !== ev.target;

// A regex to check for input types that allow selectionStart
const SELECTABLE_TYPES = /text|password|search|tel|url/;

const isSelectionAtLocation = (target, location) => {
	if (SELECTABLE_TYPES.test(target.type)) {
		return target.selectionStart === location;
	} else {
		return true;
	}
};

const handleKeyDown = handle(
	forwardWithPrevent('onKeyDown'),
	call('onKeyDown')
);

/**
 * A higher-order component that manages the
 * spotlight behavior for an {@link moonstone/Input.Input}
 *
 * @class InputSpotlightDecorator
 * @memberof moonstone/Input/InputSpotlightDecorator
 * @hoc
 * @private
 */
const InputSpotlightDecorator = hoc((config, Wrapped) => {
	const Component = Spottable({emulateMouse: false}, Wrapped);
	const forwardBlur = forward('onBlur');
	const forwardMouseDown = forward('onMouseDown');
	const forwardFocus = forward('onFocus');
	const forwardKeyUp = forward('onKeyUp');

	return class extends React.Component {
		static displayName = 'InputSpotlightDecorator';

		static propTypes = /** @lends moonstone/Input/InputSpotlightDecorator.InputSpotlightDecorator.prototype */ {
			/**
			 * Focuses the <input> when the decorator is focused via 5-way.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			autoFocus: PropTypes.bool,

			/**
			 * Applies a disabled style and the control becomes non-interactive.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			disabled: PropTypes.bool,

			/**
			 * Blurs the input when the "enter" key is pressed.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			dismissOnEnter: PropTypes.bool,

			/**
			 * Called when the internal <input> is focused.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onActivate: PropTypes.func,

			/**
			 * Called when the internal <input> loses focus.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onDeactivate: PropTypes.func,

			/**
			 * Called when the component is removed while retaining focus.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onSpotlightDisappear: PropTypes.func,

			/**
			 * Disables spotlight navigation into the component.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			spotlightDisabled: PropTypes.bool
		}

		constructor (props) {
			super(props);

			this.state = {
				focused: null,
				node: null
			};

			this.paused = new Pause('InputSpotlightDecorator');
			this.handleKeyDown = handleKeyDown.bind(this);
		}

		componentDidUpdate (_, prevState) {
			this.updateFocus(prevState);
		}

		componentWillUnmount () {
			this.paused.resume();

			if (this.state.focused === 'input') {
				const {onSpotlightDisappear} = this.props;

				if (onSpotlightDisappear) {
					onSpotlightDisappear();
				}

				releasePointer(this.state.node);
			}
		}

		updateFocus = (prevState) => {
			if (this.state.node) {
				if (Spotlight.getCurrent() !== this.state.node) {
					this.state.node.focus();
				}
			}

			const focusChanged = this.state.focused !== prevState.focused;
			if (focusChanged) {
				if (this.state.focused === 'input') {
					forward('onActivate', {type: 'onActivate'}, this.props);
					lockPointer(this.state.node);
					this.paused.pause();
				} else if (prevState.focused === 'input') {
					forward('onDeactivate', {type: 'onDeactivate'}, this.props);
					releasePointer(prevState.node);
					this.paused.resume();
				}
			}
		}

		focus = (focused, node) => {
			this.setState({focused, node});
		}

		blur = () => {
			this.setState((state) => (
				state.focused || state.node ? {focused: null, node: null} : null
			));
		}

		focusDecorator = (decorator) => {
			this.focus('decorator', decorator);
		}

		focusInput = (decorator) => {
			this.focus('input', decorator.querySelector('input'));
		}

		onBlur = (ev) => {
			if (!this.props.autoFocus) {
				if (isBubbling(ev)) {
					if (Spotlight.getPointerMode()) {
						this.blur();
						forwardBlur(ev, this.props);
					} else {
						this.focusDecorator(ev.currentTarget);
						ev.stopPropagation();
					}
				} else if (!ev.currentTarget.contains(ev.relatedTarget)) {
					// Blurring decorator but not focusing input
					forwardBlur(ev, this.props);
					this.blur();
				}
			} else if (isBubbling(ev)) {
				if (this.state.focused === 'input' && this.state.node === ev.target && ev.currentTarget !== ev.relatedTarget) {
					this.blur();
					forwardBlur(ev, this.props);
				} else {
					this.focusDecorator(ev.currentTarget);
					ev.stopPropagation();
					this.blur();
				}
			}
		}

		onMouseDown = (ev) => {
			const {disabled, spotlightDisabled} = this.props;

			this.setDownTarget(ev);
			// focus the <input> whenever clicking on any part of the component to ensure both that
			// the <input> has focus and Spotlight is paused.
			if (!disabled && !spotlightDisabled) {
				this.focusInput(ev.currentTarget);
			}

			forwardMouseDown(ev, this.props);
		}

		onFocus = (ev) => {
			forwardFocus(ev, this.props);

			// when in autoFocus mode, focusing the decorator directly will cause it to
			// forward the focus onto the <input>
			if (!isBubbling(ev) && (this.props.autoFocus && this.state.focused === null && !Spotlight.getPointerMode())) {
				this.focusInput(ev.currentTarget);
				ev.stopPropagation();
			}
		}

		onKeyDown (ev) {
			const {currentTarget, keyCode, preventDefault, target} = ev;

			// cache the target if this is the first keyDown event to ensure the component had focus
			// when the key interaction started
			this.setDownTarget(ev);

			if (this.state.focused === 'input') {
				const isDown = is('down', keyCode);
				const isLeft = is('left', keyCode);
				const isRight = is('right', keyCode);
				const isUp = is('up', keyCode);

				// move spotlight
				const shouldSpotlightMove = (
					// on left + at beginning of selection
					(isLeft && isSelectionAtLocation(target, 0)) ||
					// on right + at end of selection (note: fails on non-selectable types usually)
					(isRight && isSelectionAtLocation(target, target.value.length)) ||
					// on up
					isUp ||
					// on down
					isDown
				);

				// prevent modifying the value via 5-way for numeric fields
				if ((isUp || isDown) && target.type === 'number') {
					preventDefault();
				}

				if (shouldSpotlightMove) {
					const direction = getDirection(keyCode);
					const {getPointerMode, move, setPointerMode} = Spotlight;

					if (getPointerMode()) {
						setPointerMode(false);
					}

					stopImmediate(ev);
					this.paused.resume();

					// Move spotlight in the keypress direction
					if (move(direction)) {
						// if successful, reset the internal state
						this.blur();
					} else {
						// if there is no other spottable elements, focus `InputDecorator` instead
						this.focusDecorator(currentTarget);
					}
				} else if (isLeft || isRight) {
					// prevent 5-way nav for left/right keys within the <input>
					stopImmediate(ev);
				}
			}
		}

		onKeyUp = (ev) => {
			const {dismissOnEnter} = this.props;
			const {currentTarget, keyCode, preventDefault, target} = ev;

			// verify that we have a matching pair of key down/up events to avoid adjusting focus
			// when the component received focus mid-press
			if (target === this.downTarget) {
				this.downTarget = null;

				if (this.state.focused === 'input' && dismissOnEnter && is('enter', keyCode)) {
					this.focusDecorator(currentTarget);
					// prevent Enter onKeyPress which triggers an onMouseDown via Spotlight
					preventDefault();
				} else if (this.state.focused !== 'input' && is('enter', keyCode)) {
					this.focusInput(currentTarget);
				}
			}

			forwardKeyUp(ev, this.props);
		}

		setDownTarget (ev) {
			const {repeat, target} = ev;

			if (!repeat) {
				this.downTarget = target;
			}
		}

		render () {
			const props = Object.assign({}, this.props);
			delete props.autoFocus;
			delete props.onActivate;
			delete props.onDeactivate;

			return (
				<Component
					{...props}
					onBlur={this.onBlur}
					onMouseDown={this.onMouseDown}
					onFocus={this.onFocus}
					onKeyDown={this.handleKeyDown}
					onKeyUp={this.onKeyUp}
				/>
			);
		}
	};
});

export default InputSpotlightDecorator;
export {InputSpotlightDecorator};
