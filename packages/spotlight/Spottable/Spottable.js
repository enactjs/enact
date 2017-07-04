/**
 * Exports the {@link spotlight/Spottable.Spottable} Higher-order Component and
 * the {@link spotlight/Spottable.spottableClass} `className`. The default export is
 * {@link spotlight/Spottable.Spottable}.
 *
 * @module spotlight/Spottable
 */

import {forward, handle} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {is} from '@enact/core/keymap';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Accelerator from '../Accelerator';
import {getContainersForNode} from '../src/container';
import Spotlight from '../src/spotlight';

/**
 * The class name for spottable components. In general, you do not need to directly access this class
 *
 * @memberof spotlight/Spottable
 * @public
 */
const spottableClass = 'spottable';

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

const SelectAccelerator = new Accelerator();
// Last instance of spottable to be accelerating
let lastFocusTarget = null;

/**
 * Default configuration for Spottable
 *
 * @hocconfig
 * @memberof spotlight/Spottable.Spottable
 */
const defaultConfig = {
	/**
	 * Whether or not the component should emulate mouse events as a response
	 * to Spotlight 5-way events.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 * @memberof spotlight/Spottable.Spottable.defaultConfig
	 */
	emulateMouse: true
};

/**
 * Constructs a Spotlight 5-way navigation-enabled Higher-order Component.
 *
 * Example:
 * ```
 *	const SpottableComponent = Spottable(Component);
 * ```
 * @class Spottable
 * @memberof spotlight/Spottable
 * @param  {Object} defaultConfig Set of default configuration parameters
 * @param  {Function} Wrapped Component to wrap
 *
 * @hoc
 * @returns {Function} Spottable
 */
const Spottable = hoc(defaultConfig, (config, Wrapped) => {
	const {emulateMouse} = config;

	return class extends React.Component {
		static displayName = 'Spottable'

		static propTypes = /** @lends spotlight/Spottable.Spottable.prototype */ {
			/**
			 * Whether or not the component is in a disabled state.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			disabled: PropTypes.bool,

			/**
			 * The handler to run when the component is removed while retaining focus.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onSpotlightDisappear: PropTypes.func,

			/**
			 * The handler to run when the 5-way down key is pressed.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onSpotlightDown: PropTypes.func,

			/**
			 * The handler to run when the 5-way left key is pressed.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onSpotlightLeft: PropTypes.func,

			/**
			 * The handler to run when the 5-way right key is pressed.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onSpotlightRight: PropTypes.func,

			/**
			 * The handler to run when the 5-way up key is pressed.
			 *
			 * @type {Function}
			 * @param {Object} event
			 * @public
			 */
			onSpotlightUp: PropTypes.func,

			/**
			 * When `true`, the component cannot be navigated using spotlight.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			spotlightDisabled: PropTypes.bool,

			/**
			 * The tabIndex of the component. This value will default to -1 if left
			 * unset and the control is spottable.
			 *
			 * @type {Number}
			 * @public
			 */
			tabIndex: PropTypes.number
		}

		constructor (props) {
			super(props);
			this.state = {
				spotted: false
			};
		}

		componentDidMount () {
			// eslint-disable-next-line react/no-find-dom-node
			this.node = ReactDOM.findDOMNode(this);
		}

		componentDidUpdate (prevProps) {
			// if the component is spotted and became disabled,
			if (this.state.spotted && !prevProps.disabled && this.props.disabled) {
				forward('onSpotlightDisappear', null, this.props);
				if (SelectAccelerator.isAccelerating()) {
					// Forward mouseUp before the focus target changes
					forward('onMouseUp', null, this.props);
					SelectAccelerator.cancel();
				}

				// if spotlight didn't move, find something else to spot starting from here
				const current = Spotlight.getCurrent();
				if (!Spotlight.getPointerMode() && (!current || this.node === current)) {
					this.node.blur();

					getContainersForNode(this.node).reverse().reduce((found, id) => {
						return found || Spotlight.focus(id);
					}, false);
				}
			}
		}

		componentWillUnmount () {
			this.node = null;
			if (this.state.spotted) {
				forward('onSpotlightDisappear', null, this.props);
			}
		}

		shouldEmulateMouse = ({currentTarget, repeat, type, which}) => {
			return emulateMouse && !repeat && (
				// emulate mouse events for any remote okay button event
				which === REMOTE_OK_KEY ||
				// or a non-keypress enter event or any enter event on a non-keyboard accessible
				// control
				(
					which === ENTER_KEY &&
					(type !== 'keypress' || !isKeyboardAccessible(currentTarget))
				)
			);
		}

		forwardSpotlightEvents = (ev, {onSpotlightDown, onSpotlightLeft, onSpotlightRight, onSpotlightUp}) => {
			const {keyCode} = ev;

			if (onSpotlightDown && is('down', keyCode)) {
				onSpotlightDown(ev);
			} else if (onSpotlightLeft && is('left', keyCode)) {
				onSpotlightLeft(ev);
			} else if (onSpotlightRight && is('right', keyCode)) {
				onSpotlightRight(ev);
			} else if (onSpotlightUp && is('up', keyCode)) {
				onSpotlightUp(ev);
			}

			return true;
		}

		handleSelect = (ev) => {
			// Only apply accelerator if handling select
			if ((ev.which === REMOTE_OK_KEY) || (ev.which === ENTER_KEY)) {
				SelectAccelerator.processKey(ev, this.handleSelectCallback);
				return false;
			}
			return true;
		}

		setFocusTarget = () => {
			lastFocusTarget = this;
			return true;
		}

		resetAccelerator = () => {
			SelectAccelerator.reset();
			return lastFocusTarget === this;
		}

		handle = handle.bind(this)

		handleSelectCallback = this.handle(
			this.setFocusTarget,
			forward('onKeyDown'),
			this.shouldEmulateMouse,
			forward('onMouseDown')
		)

		handleKeyDown = this.handle(
			this.handleSelect,
			forward('onKeyDown'),
			this.forwardSpotlightEvents
		)

		handleKeyUp = this.handle(
			forward('onKeyUp'),
			this.resetAccelerator,
			this.shouldEmulateMouse,
			forward('onMouseUp'),
			forward('onClick')
		)

		handleBlur = (ev) => {
			if (ev.currentTarget === ev.target) {
				this.setState({spotted: false});
			}

			if (Spotlight.isMuted(ev.target)) {
				ev.stopPropagation();
			} else {
				forward('onBlur', ev, this.props);
			}
		}

		handleFocus = (ev) => {
			if (ev.currentTarget === ev.target) {
				this.setState({spotted: true});
			}

			if (Spotlight.isMuted(ev.target)) {
				ev.stopPropagation();
			} else {
				forward('onFocus', ev, this.props);
			}
		}

		render () {
			const {disabled, spotlightDisabled, ...rest} = this.props;
			const spottable = !disabled && !spotlightDisabled;
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
				rest.onBlur = this.handleBlur;
				rest.onFocus = this.handleFocus;
				rest.onKeyDown = this.handleKeyDown;
				rest.onKeyUp = this.handleKeyUp;

				if (rest.className) {
					rest.className += ' ' + spottableClass;
				} else {
					rest.className = spottableClass;
				}
			}

			return (
				<Wrapped
					{...rest}
					disabled={disabled}
					tabIndex={tabIndex}
				/>
			);
		}
	};
});

export default Spottable;
export {Spottable, spottableClass};
