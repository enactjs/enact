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
	/**
	 * Whether or not the component should emulate mouse events as a response
	 * to Spotlight 5-way events.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	emulateMouse: true
};

/**
 * Constructs a Spotlight 5-way navigation-enabled Higher-order Component.
 *
 * @example
 *	const SpottableComponent = Spottable(Component);
 *
 * @param  {Object} defaultConfig Set of default configuration parameters
 * @param  {Function} Higher-order component
 *
 * @returns {Function} Spottable
 */
const Spottable = hoc(defaultConfig, (config, Wrapped) => kind({
	name: 'Spottable',

	propTypes: {
		/**
		 * Whether or not the component is decorated by another spottable component.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		decorated: React.PropTypes.bool,

		/**
		 * Whether or not the component is in a disabled state.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: React.PropTypes.bool,

		/**
		 * Whether or not the component can be navigated using spotlight.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
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
