import {kind, hoc} from 'enact-core';
import React from 'react';

const spottableClass = 'spottable';
const decoratedProp = 'data-spot-decorated';

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
		if (mouseHandler && shouldEmulateMouse(ev)) mouseHandler(ev);
	};
};

const defaultConfig = {
	emulateMouse: true
};

const Spottable = hoc(defaultConfig, (config, Wrapped) => kind({
	name: 'Spottable',

	propTypes: {
		decorated: React.PropTypes.bool,
		disabled: React.PropTypes.bool,
		spotlightDisabled: React.PropTypes.bool
	},

	styles: {
		className: spottableClass,
		prop: 'classes'
	},

	computed: !config.emulateMouse ? null : {
		onKeyPress: forwardEnter('onKeyPress', 'onClick'),
		onKeyDown: forwardEnter('onKeyDown', 'onMouseDown'),
		onKeyUp: forwardEnter('onKeyUp', 'onMouseUp')
	},

	render: ({classes, className, decorated, ...rest}) => {
		const spottable = !rest.disabled && !rest.spotlightDisabled;
		let tabIndex = rest.tabIndex;
		rest[decoratedProp] = decorated;

		if (tabIndex == null && spottable) {
			tabIndex = -1;
		}

		return (
			<Wrapped
				{...rest}
				className={spottable ? classes : className}
				tabIndex={tabIndex}
			/>
		);
	}
}));

export default Spottable;
export {Spottable, spottableClass, decoratedProp};
