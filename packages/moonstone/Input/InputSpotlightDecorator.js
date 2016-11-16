import hoc from '@enact/core/hoc';
import React from 'react';
import {Spotlight, Spottable} from '@enact/spotlight';

const preventSpotlightNavigation = (ev) => {
	ev.nativeEvent.stopImmediatePropagation();
};

const isBubbling = (ev) => ev.currentTarget !== ev.target;

const InputSpotlightDecorator = hoc((config, Wrapped) => {
	const Component = Spottable(Wrapped);

	return class extends React.Component {
		static displayName = 'InputSpotlightDecorator';

		constructor (props) {
			super(props);

			this.state = {
				focused: null,
				node: null
			};
		}

		componentDidUpdate () {
			if (this.state.node) {
				this.state.node.focus();
			}

			if (this.state.focused === 'input') {
				Spotlight.pause();
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
			Spotlight.resume();
		}

		focusDecorator = (decorator) => {
			this.focus('decorator', decorator);
			Spotlight.resume();
		}

		focusInput = (decorator) => {
			this.focus('input', decorator.querySelector('input'));
		}

		onBlur = (ev) => {
			const {onBlur, noDecorator} = this.props;
			if (!noDecorator) {
				if (isBubbling(ev)) {
					if (Spotlight.getPointerMode()) {
						this.blur();
						if (onBlur) {
							onBlur(ev);
						}
					} else {
						this.focusDecorator(ev.currentTarget);
						ev.stopPropagation();
					}
				}
			} else {
				Spotlight.resume();

				// only blur when the input should be focused and is the target of the blur
				if (this.state.focused === 'input' && this.state.node === ev.target) {
					this.blur();
					onBlur(ev);
				}
			}
		}

		onClick = (ev) => {
			const {onClick, spotlightDisabled} = this.props;

			// focus the <input> whenever clicking on any part of the component to ensure both that
			// the <input> has focus and Spotlight is paused.
			if (!spotlightDisabled) {
				this.focusInput(ev.currentTarget);
			}

			if (onClick) onClick(ev);
		}

		onFocus = (ev) => {
			const {onFocus, noDecorator} = this.props;
			if (onFocus) onFocus(ev);

			// when in noDecorator mode, focusing the decorator directly will cause it to
			// forward the focus onto the <input>
			if (noDecorator && !isBubbling(ev)) {
				this.focusInput(ev.currentTarget);
				ev.stopPropagation();
			}
		}

		onKeyDown = (ev) => {
			const {dismissOnEnter, noDecorator, onKeyDown} = this.props;
			const {currentTarget, keyCode, target} = ev;

			if (this.state.focused === 'input') {
				// switch focus to the decorator ...
				const shouldFocusDecorator = (
					// on enter + dismissOnEnter
					(keyCode === 13 && dismissOnEnter) ||
					// on left + at beginning of selection
					(keyCode === 37 && target.selectionStart === 0) ||
					// on right + at end of selection
					(keyCode === 39 && target.selectionStart === target.value.length) ||
					// on up
					keyCode === 38 ||
					// on down
					keyCode === 40
				);

				if (shouldFocusDecorator) {
					if (!noDecorator) {
						this.focusDecorator(currentTarget);

						// prevent Enter onKeyPress which triggers an onClick via Spotlight
						if (keyCode === 13) {
							ev.preventDefault();
						}

						// prevent 5-way navigation onto other components when focusing the
						// decorator explicitly
						preventSpotlightNavigation(ev);
					}
				} else if (keyCode === 37 || keyCode === 39) {
					// prevent 5-way nav for left/right keys within the <input>
					preventSpotlightNavigation(ev);
				}
			}

			if (onKeyDown) onKeyDown(ev);
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
