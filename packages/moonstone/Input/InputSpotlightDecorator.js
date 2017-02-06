import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {is} from '@enact/core/keymap';
import React from 'react';
import {Spotlight, Spottable} from '@enact/spotlight';

const preventSpotlightNavigation = (ev) => {
	ev.nativeEvent.stopImmediatePropagation();
};

const isBubbling = (ev) => ev.currentTarget !== ev.target;

/**
 * {@link moonstone/Input.InputSpotlightDecorator} is a Higher-order Component that manages the
 * spotlight behavior for an {@link moonstone/Input.Input}
 *
 * @class InputSpotlightDecorator
 * @memberof moonstone/Input/InputSpotlightDecorator
 * @hoc
 * @private
 */
const InputSpotlightDecorator = hoc((config, Wrapped) => {
	const Component = Spottable(Wrapped);
	const forwardBlur = forward('onBlur');
	const forwardClick = forward('onClick');
	const forwardFocus = forward('onFocus');
	const forwardKeyDown = forward('onKeyDown');

	return class extends React.Component {
		static displayName = 'InputSpotlightDecorator';

		static propTypes = /** @lends moonstone/Input/InputSpotlightDecorator.InputSpotlightDecorator.prototype */ {
			/**
			 * When `true`, applies a disabled style and the control becomes non-interactive.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			disabled: React.PropTypes.bool,

			/**
			 * When `true`, blurs the input when the "enter" key is pressed.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			dismissOnEnter: React.PropTypes.bool,

			/**
			 * When `true`, prevents the decorator from receiving a visible focus state
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			noDecorator: React.PropTypes.bool,

			/**
			 * The handler to run when the component is removed while retaining focus.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onSpotlightDisappear: React.PropTypes.func,

			/**
			 * When `true`, prevents navigation of the component using spotlight
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			spotlightDisabled: React.PropTypes.bool
		}

		constructor (props) {
			super(props);

			this.state = {
				direction: null,
				focused: null,
				node: null
			};
		}

		componentDidUpdate (_, prevState) {
			if (this.state.node) {
				this.state.node.focus();
			}

			if (this.state.focused === 'input') {
				Spotlight.pause();
			} else if (prevState.focused === 'input') {
				Spotlight.resume();
			}

			if (this.state.direction) {
				Spotlight.move(this.state.direction);
			}
		}

		componentWillUnmount () {
			if (this.state.focused === 'input') {
				const {onSpotlightDisappear} = this.props;

				Spotlight.resume();

				if (onSpotlightDisappear) {
					onSpotlightDisappear();
				}
			}
		}

		focus = (focused, node) => {
			this.setState({focused, node, direction: null});
		}

		blur = () => {
			this.setState({
				direction: null,
				focused: null,
				node: null
			});
		}

		focusDecorator = (decorator) => {
			this.focus('decorator', decorator);
		}

		focusInput = (decorator) => {
			this.focus('input', decorator.querySelector('input'));
		}

		leaveOnUpdate = (direction) => {
			this.setState({direction});
		}

		onBlur = (ev) => {
			if (!this.props.noDecorator) {
				if (isBubbling(ev) && !this.state.direction) {
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
			} else if (this.state.focused === 'input' && this.state.node === ev.target) {
				if (ev.currentTarget === ev.relatedTarget) {
					// if the focused item (ev.relatedTarget) is the current target (the decorator),
					// prevent the blur from propagating so the input will be re-focused on update.
					ev.stopPropagation();
				} else {
					// only blur when the input should be focused and is the target of the blur
					this.blur();
					forwardBlur(ev, this.props);
				}
			}
		}

		onClick = (ev) => {
			const {disabled, spotlightDisabled} = this.props;

			// focus the <input> whenever clicking on any part of the component to ensure both that
			// the <input> has focus and Spotlight is paused.
			if (!disabled && !spotlightDisabled) {
				this.focusInput(ev.currentTarget);
			}

			forwardClick(ev, this.props);
		}

		onFocus = (ev) => {
			forwardFocus(ev, this.props);

			// when in noDecorator mode, focusing the decorator directly will cause it to
			// forward the focus onto the <input>
			if (this.props.noDecorator && !isBubbling(ev)) {
				this.focusInput(ev.currentTarget);
				ev.stopPropagation();
			}
		}

		onKeyDown = (ev) => {
			const {dismissOnEnter, noDecorator} = this.props;
			const {currentTarget, keyCode, target} = ev;

			if (this.state.focused === 'input') {
				const isDown = is('down', keyCode);
				const isEnter = is('enter', keyCode);
				const isLeft = is('left', keyCode);
				const isRight = is('right', keyCode);
				const isUp = is('up', keyCode);

				// switch focus to the decorator ...
				const shouldFocusDecorator = (
					// on enter + dismissOnEnter
					(isEnter && dismissOnEnter) ||
					// on left + at beginning of selection
					(isLeft && target.selectionStart === 0) ||
					// on right + at end of selection
					(isRight && target.selectionStart === target.value.length) ||
					// on up
					isUp ||
					// on down
					isDown
				);

				if (shouldFocusDecorator) {
					if (!noDecorator) {
						this.focusDecorator(currentTarget);

						// prevent Enter onKeyPress which triggers an onClick via Spotlight
						if (isEnter) {
							ev.preventDefault();
						}

						// prevent 5-way navigation onto other components when focusing the
						// decorator explicitly
						preventSpotlightNavigation(ev);

						if (target.value.length === 0 && !isEnter) {
							const direction =	isLeft && 'left' ||
												isUp && 'up' ||
												isRight && 'right' ||
												isDown && 'down';
							this.leaveOnUpdate(direction);
						}
					}
				} else if (isLeft || isRight) {
					// prevent 5-way nav for left/right keys within the <input>
					preventSpotlightNavigation(ev);
				}
			}

			forwardKeyDown(ev, this.props);
		}

		render () {
			const props = Object.assign({}, this.props);
			delete props.noDecorator;

			return (
				<Component
					{...props}
					focused={this.state.focused === 'input'}
					onBlur={this.onBlur}
					onClick={this.onClick}
					onFocus={this.onFocus}
					onKeyDown={this.onKeyDown}
				/>
			);
		}
	};
});

export default InputSpotlightDecorator;
export {InputSpotlightDecorator};
