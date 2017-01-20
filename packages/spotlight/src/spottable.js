import {hoc} from '@enact/core';
import {forward} from '@enact/core/handle';
import React from 'react';
import Spotlight from './spotlight';

const spottableClass = 'spottable';
const spottableDisabledClass = 'spottableDisabled';

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
 * @memberof spotlight
 * @param  {Object} defaultConfig Set of default configuration parameters
 * @param  {Function} Higher-order component
 *
 * @returns {Function} Spottable
 */
const Spottable = hoc(defaultConfig, (config, Wrapped) => {
	const {emulateMouse} = config;
	const forwardBlur = forward('onBlur');
	const forwardFocus = forward('onFocus');
	const forwardKeyPress = forwardEnter('onKeyPress', 'onClick');
	const forwardKeyDown = forwardEnter('onKeyDown', 'onMouseDown');
	const forwardKeyUp = forwardEnter('onKeyUp', 'onMouseUp');

	return class extends React.Component {
		static displayName = 'Spottable'

		static propTypes = {
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
			spotlightDisabled: React.PropTypes.bool,

			/**
			 * The tabIndex of the component. This value will default to -1 if left
			 * unset and the control is spottable.
			 *
			 * @type {Number}
			 * @public
			 */
			tabIndex: React.PropTypes.number
		}

		constructor (props) {
			super(props);
			this.state = {
				spotted: false
			};
		}

		onBlur = (e) => {
			if (e.currentTarget === e.target) {
				this.setState({spotted: false});
			}

			if (Spotlight.isMuted(e.target)) {
				e.stopPropagation();
			} else {
				forwardBlur(e, this.props);
			}
		}

		onFocus = (e) => {
			if (e.currentTarget === e.target) {
				this.setState({spotted: true});
			}

			if (Spotlight.isMuted(e.target)) {
				e.stopPropagation();
			} else {
				forwardFocus(e, this.props);
			}
		}

		render () {
			const {disabled, spotlightDisabled, ...rest} = this.props;
			const spottableDisabled = this.state.spotted && disabled;
			const spottable = (spottableDisabled || !disabled) && !spotlightDisabled;
			const classes = spottableDisabled ? spottableClass + ' ' + spottableDisabledClass : spottableClass;
			const componentDisabled = !spottable && disabled;
			let tabIndex = rest.tabIndex;

			if (tabIndex == null && spottable) {
				tabIndex = -1;
			}

			if (spottable) {
				rest['onBlur'] = this.onBlur;
				rest['onFocus'] = this.onFocus;
				if (emulateMouse && !spottableDisabled) {
					rest['onKeyPress'] = forwardKeyPress(this.props);
					rest['onKeyDown'] = forwardKeyDown(this.props);
					rest['onKeyUp'] = forwardKeyUp(this.props);
				}
				if (rest.className) {
					rest.className += ' ' + classes;
				} else {
					rest.className = classes;
				}
			}

			return (
				<Wrapped
					{...rest}
					disabled={componentDisabled}
					tabIndex={tabIndex}
				/>
			);
		}
	};
});

export default Spottable;
export {Spottable, spottableClass};
