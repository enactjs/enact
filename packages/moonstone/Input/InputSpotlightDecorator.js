import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import React from 'react';
import Spotlight from '@enact/spotlight';

const preventSpotlightNavigation = (ev) => {
	ev.nativeEvent.stopImmediatePropagation();
};

const handleDecoratorClick = (ev) => {
	// if <div> is event originator
	if (ev.target === ev.currentTarget) {
		ev.target.querySelector('input').focus();
	}
};

const handleDecoratorBlur = (ev) => {
	const {currentTarget, target} = ev;
	// if the event bubbled up
	if (target !== currentTarget) {
		currentTarget.focus();
		preventSpotlightNavigation(ev);
	}
};

const focus = (node) => {
	if (node) {
		node.focus();
	}
};

const InputSpotlightDecorator = hoc((config, Wrapped) => kind({
	name: 'InputSpotlightDecorator',

	computed: {
		onBlur: ({onBlur}) => (ev) => {
			handleDecoratorBlur(ev);
			if (onBlur) onBlur(ev);
		},
		onClick: ({onClick}) => (ev) => {
			handleDecoratorClick(ev);
			if (onClick) onClick(ev);
		},
		onKeyDown: ({dismissOnEnter, onKeyDown}) => (ev) => {
			const {currentTarget, keyCode, target} = ev;
			const shouldFocusInput = target === currentTarget && keyCode === 13;

			if (shouldFocusInput) {
				focus(currentTarget.querySelector('input'));
			} else {
				const isInputFocused = target !== currentTarget;
				const shouldFocusDecorator = (
					// input is focused and ...
					isInputFocused && (
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

				const shouldStopPropagation = isInputFocused && (keyCode === 37 || keyCode === 39);

				if (shouldFocusDecorator) {
					focus(currentTarget);
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
