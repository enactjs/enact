import deprecate from '@enact/core/internal/deprecate';
import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {is} from '@enact/core/keymap';
import React from 'react';
import PropTypes from 'prop-types';
import Spotlight from '@enact/spotlight';
import Spottable from '@enact/spotlight/Spottable';

import css from './Input.less';

const preventSpotlightNavigation = (ev) => {
	ev.nativeEvent.stopImmediatePropagation();
};

const isBubbling = (ev) => ev.currentTarget !== ev.target;

// A regex to check for input types that allow selectionStart
const SELECTABLE_TYPES = /text|password|search|tel|url/;

const safeSelectionStart = (target) => {
	if (SELECTABLE_TYPES.test(target.type)) {
		return target.selectionStart;
	} else {
		return 0;
	}
};

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
			 * When `true`, focusing the decorator directly via 5-way will forward the focus onto the <input>
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			autoFocus: PropTypes.bool,

			/**
			 * When `true`, applies a disabled style and the control becomes non-interactive.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			disabled: PropTypes.bool,

			/**
			 * When `true`, blurs the input when the "enter" key is pressed.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			dismissOnEnter: PropTypes.bool,

			/**
			 * When `true`, prevents the decorator from receiving a visible focus state
			 *
			 * @type {Boolean}
			 * @default false
			 * @deprecated will be replaced by `autoFocus` in 2.0.0
			 * @public
			 */
			noDecorator: PropTypes.bool,

			/**
			 * The handler to run when the component is removed while retaining focus.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onSpotlightDisappear: PropTypes.func,

			/**
			 * When `true`, prevents navigation of the component using spotlight
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

			if (props.noDecorator) {
				deprecate({name: 'noDecorator', since: '1.3.0', replacedBy: 'autoFocus'});
			}
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
			this.setState({focused, node});
		}

		blur = () => {
			this.setState({
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

		onBlur = (ev) => {
			if (!this.props.noDecorator && !this.props.autoFocus) {
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
			} else if (this.props.autoFocus) {
				if (isBubbling(ev)) {
					if (this.state.focused === 'input' && this.state.node === ev.target && ev.currentTarget !== ev.relatedTarget) {
						this.blur();
						forwardBlur(ev, this.props);
					} else {
						this.focusDecorator(ev.currentTarget);
						ev.stopPropagation();
						this.blur();
					}
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

			// when in noDecorator or autoFocus mode, focusing the decorator directly will cause it to
			// forward the focus onto the <input>
			if (!isBubbling(ev) && (this.props.noDecorator || this.props.autoFocus && this.state.focused === null && !Spotlight.getPointerMode())) {
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
					(isLeft && safeSelectionStart(target) === 0) ||
					// on right + at end of selection (note: fails on non-selectable types usually)
					(isRight && safeSelectionStart(target) === target.value.length) ||
					// on up
					isUp ||
					// on down
					isDown
				);

				if (shouldFocusDecorator) {
					if (!noDecorator) {
						// we really only support the number type properly, so only handling this case
						if (ev.target.type === 'number') {
							ev.preventDefault();
						}
						this.focusDecorator(currentTarget);

						// prevent Enter onKeyPress which triggers an onClick via Spotlight
						if (isEnter) {
							ev.preventDefault();
						}
					}
				} else if (isLeft || isRight) {
					// prevent 5-way nav for left/right keys within the <input>
					preventSpotlightNavigation(ev);
				}
			}
			forwardKeyDown(ev, this.props);
		}

		calcClassName () {
			const {className, noDecorator} = this.props;
			if (noDecorator) {
				return className ? css.noDecorator + ' ' + className : css.noDecorator;
			}

			return className;
		}

		render () {
			const props = Object.assign({}, this.props);
			delete props.autoFocus;
			delete props.noDecorator;

			return (
				<Component
					{...props}
					className={this.calcClassName()}
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
