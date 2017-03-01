import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {is} from '@enact/core/keymap';
import React from 'react';

import Spotlight from '../src/spotlight';

/**
 * The class name for spottable components. In general, you do not need to directly access this class
 *
 * @memberof spotlight
 * @public
 */
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

/**
 * Default configuration for Spottable
 *
 * @hocconfig
 * @memberof spotlight.Spottable
 */
const defaultConfig = {
	/**
	 * Whether or not the component should emulate mouse events as a response
	 * to Spotlight 5-way events.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 * @memberof spotlight.Spottable.defaultConfig
	 */
	emulateMouse: true
};

/**
 * Constructs a Spotlight 5-way navigation-enabled Higher-order Component.
 *
 * @example
 *	const SpottableComponent = Spottable(Component);
 *
 * @class Spottable
 * @memberof spotlight
 * @param  {Object} defaultConfig Set of default configuration parameters
 * @param  {Function} Wrapped Component to wrap
 *
 * @hoc
 * @returns {Function} Spottable
 */
const Spottable = hoc(defaultConfig, (config, Wrapped) => {
	const {emulateMouse} = config;
	const forwardBlur = forward('onBlur');
	const forwardFocus = forward('onFocus');
	const forwardEnterKeyPress = forwardEnter('onKeyPress', 'onClick');
	const forwardEnterKeyDown = forwardEnter('onKeyDown', 'onMouseDown');
	const forwardEnterKeyUp = forwardEnter('onKeyUp', 'onMouseUp');
	const forwardKeyDown = forward('onKeyDown');

	return class extends React.Component {
		static displayName = 'Spottable'

		static propTypes = /** @lends spotlight.Spottable.prototype */ {
			/**
			 * Whether or not the component is in a disabled state.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			disabled: React.PropTypes.bool,

			/**
			 * The handler to run when the component is removed while retaining focus.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onSpotlightDisappear: React.PropTypes.func,

			/**
			 * The handler to run when the 5-way down key is pressed.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onSpotlightDown: React.PropTypes.func,

			/**
			 * The handler to run when the 5-way left key is pressed.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onSpotlightLeft: React.PropTypes.func,

			/**
			 * The handler to run when the 5-way right key is pressed.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onSpotlightRight: React.PropTypes.func,

			/**
			 * The handler to run when the 5-way up key is pressed.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onSpotlightUp: React.PropTypes.func,

			/**
			 * When `true`, the component cannot be navigated using spotlight.
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

		componentWillUnmount () {
			const {onSpotlightDisappear} = this.props;

			if (this.state.spotted && onSpotlightDisappear) {
				onSpotlightDisappear();
			}
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

		onKeyDown = (e) => {
			const {disabled, onSpotlightDown, onSpotlightLeft, onSpotlightRight, onSpotlightUp} = this.props;
			const keyCode = e.keyCode;

			if (onSpotlightDown && is('down', keyCode)) {
				onSpotlightDown(e);
			} else if (onSpotlightLeft && is('left', keyCode)) {
				onSpotlightLeft(e);
			} else if (onSpotlightRight && is('right', keyCode)) {
				onSpotlightRight(e);
			} else if (onSpotlightUp && is('up', keyCode)) {
				onSpotlightUp(e);
			}

			if (emulateMouse && !(this.state.spotted && disabled) && is('enter', keyCode)) {
				forwardEnterKeyDown(this.props)(e);
			} else {
				forwardKeyDown(e, this.props);
			}
		}

		render () {
			const {disabled, spotlightDisabled, ...rest} = this.props;
			const spottableDisabled = this.state.spotted && disabled;
			const spottable = (spottableDisabled || !disabled) && !spotlightDisabled;
			const classes = spottableDisabled ? spottableClass + ' ' + spottableDisabledClass : spottableClass;
			const componentDisabled = !spottable && disabled;
			let tabIndex = rest.tabIndex;

			delete rest.onSpotlightDisappear;
			delete rest.onSpotlightDown;
			delete rest.onSpotlightLeft;
			delete rest.onSpotlightRight;
			delete rest.onSpotlightUp;

			if (tabIndex == null && spottable) {
				tabIndex = -1;
			}

			if (spottable) {
				rest['onBlur'] = this.onBlur;
				rest['onFocus'] = this.onFocus;
				rest['onKeyDown'] = this.onKeyDown;

				if (emulateMouse && !spottableDisabled) {
					rest['onKeyPress'] = forwardEnterKeyPress(this.props);
					rest['onKeyUp'] = forwardEnterKeyUp(this.props);
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
