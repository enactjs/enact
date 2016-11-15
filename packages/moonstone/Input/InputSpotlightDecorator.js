import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import React from 'react';
import {Spotlight, Spottable} from '@enact/spotlight';

const preventSpotlightNavigation = (ev) => {
	ev.nativeEvent.stopImmediatePropagation();
};

const focus = (node) => {
	if (node) {
		node.focus();
	}
};

const focusDecorator = (decorator) => {
	focus(decorator);
	Spotlight.resume();
};

const focusInput = (decorator) => {
	focus(decorator.querySelector('input'));
	Spotlight.pause();
};

const isBubbling = (ev) => ev.currentTarget !== ev.target;

const InputSpotlightDecorator = hoc((config, Wrapped) => {
	const Decorator = kind({
		name: 'InputSpotlightDecorator',

		computed: {
			onBlur: ({onBlur, noDecorator}) => (ev) => {
				if (!noDecorator && isBubbling(ev)) {
					focusDecorator(ev.currentTarget);
					preventSpotlightNavigation(ev);
				}

				if (onBlur) onBlur(ev);
			},
			onClick: ({onClick, spotlightDisabled}) => (ev) => {
				// focus the <input> whenever clicking on any part of the component to ensure both that
				// the <input> has focus and Spotlight is paused.
				if (!spotlightDisabled) {
					focusInput(ev.currentTarget);
				}

				if (onClick) onClick(ev);
			},
			onFocus: ({onFocus, noDecorator}) => (ev) => {
				// when in noDecorator mode, focusing the decorator directly will cause it to forward
				// the focus onto the <input>
				if (noDecorator && !isBubbling(ev)) {
					focusInput(ev.currentTarget);
				} else if (onFocus) {
					onFocus(ev);
				}
			},
			onKeyDown: ({dismissOnEnter, noDecorator, onKeyDown}) => (ev) => {
				const {currentTarget, keyCode, target} = ev;
				const fromInput = isBubbling(ev);
				const shouldFocusInput = !fromInput && keyCode === 13;

				if (shouldFocusInput) {
					focusInput(currentTarget);
				} else {
					const shouldFocusDecorator = (
						// input is focused and ...
						fromInput && (
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
						)
					);

					const shouldStopPropagation = fromInput && (keyCode === 37 || keyCode === 39);

					if (shouldFocusDecorator && !noDecorator) {
						focusDecorator(currentTarget);
						preventSpotlightNavigation(ev);
					} else if (shouldStopPropagation) {
						preventSpotlightNavigation(ev);
					}
				}

				if (onKeyDown) onKeyDown(ev);
			}
		},

		render: (props) => {
			delete props.noDecorator;
			delete props.spotlightDisabled;

			return (
				<Wrapped {...props} />
			);
		}
	});

	return Spottable(
		{spotlightDisabledProp: 'spotlightDisabled'},
		Decorator
	);
});

export default InputSpotlightDecorator;
export {InputSpotlightDecorator};
