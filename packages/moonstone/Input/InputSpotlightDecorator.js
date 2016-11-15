import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import React from 'react';
import Spotlight from '@enact/spotlight';

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

const InputSpotlightDecorator = hoc((config, Wrapped) => kind({
	name: 'InputSpotlightDecorator',

	computed: {
		onBlur: ({onBlur}) => (ev) => {
			if (isBubbling(ev)) {
				focusDecorator(ev.currentTarget);
				preventSpotlightNavigation(ev);
			}

			if (onBlur) onBlur(ev);
		},
		onClick: ({onClick}) => (ev) => {
			// focus the <input> whenever clicking on any part of the component to ensure both that
			// the <input> has focus and Spotlight is paused.
			focusInput(ev.currentTarget);

			if (onClick) onClick(ev);
		},
		onKeyDown: ({dismissOnEnter, onKeyDown}) => (ev) => {
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

				if (shouldFocusDecorator) {
					focusDecorator(currentTarget);
					preventSpotlightNavigation(ev);
				} else if (shouldStopPropagation) {
					preventSpotlightNavigation(ev);
				}
			}

			if (onKeyDown) onKeyDown(ev);
		}
	},

	render: (props) => (
		<Wrapped {...props} />
	)
}));

export default InputSpotlightDecorator;
export {InputSpotlightDecorator};
