import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import React from 'react';
import {Spotlight, Spottable} from '@enact/spotlight';

const preventSpotlightNavigation = (ev) => {
	ev.nativeEvent.stopImmediatePropagation();
};

const isBubbling = (ev) => ev.currentTarget !== ev.target;

const InputSpotlightDecorator = hoc((config, Wrapped) => {
	const Component = Spottable(Wrapped);
	const forwardBlur = forward('onBlur');
	const forwardClick = forward('onClick');
	const forwardFocus = forward('onFocus');
	const forwardKeyDown = forward('onKeyDown');

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
			} else {
				Spotlight.resume();
			}

			if (this.state.direction) {
				Spotlight.move(this.state.direction);
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
				}
			} else if (this.state.focused === 'input' && this.state.node === ev.target) {
				// only blur when the input should be focused and is the target of the blur
				this.blur();
				forwardBlur(ev, this.props);
			}
		}

		onClick = (ev) => {
			// focus the <input> whenever clicking on any part of the component to ensure both that
			// the <input> has focus and Spotlight is paused.
			if (!this.props.spotlightDisabled) {
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

						if (target.value.length === 0 && keyCode !== 13) {
							const direction =	keyCode === 37 && 'left' ||
												keyCode === 38 && 'up' ||
												keyCode === 39 && 'right' ||
												keyCode === 40 && 'down';
							this.leaveOnUpdate(direction);
						}
					}
				} else if (keyCode === 37 || keyCode === 39) {
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
