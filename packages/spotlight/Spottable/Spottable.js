/**
 * Exports the {@link spotlight/Spottable.Spottable} higher-order component and
 * the {@link spotlight/Spottable.spottableClass} `className`. The default export is
 * {@link spotlight/Spottable.Spottable}.
 *
 * @module spotlight/Spottable
 */

import {forward, forwardWithPrevent, handle} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {is} from '@enact/core/keymap';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import {getContainersForNode} from '../src/container';
import {hasPointerMoved} from '../src/pointer';
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

const isSpottable = (props) => !props.disabled && !props.spotlightDisabled;

// Last instance of spottable to be focused
let lastSelectTarget = null;
// Should we prevent select being passed through
let selectCancelled = false;

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
 * Constructs a Spotlight 5-way navigation-enabled higher-order component.
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
			 * Used to identify this component within the Spotlight system
			 *
			 * @type {String}
			 * @public
			 */
			spotlightId: PropTypes.string,

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
			this.isFocused = false;
			this.isHovered = false;

			this.state = {
				focusedWhenDisabled: false
			};
		}

		componentDidMount () {
			// eslint-disable-next-line react/no-find-dom-node
			this.node = ReactDOM.findDOMNode(this);
		}

		UNSAFE_componentWillReceiveProps (nextProps) {
			const focusedWhenDisabled = this.isFocused && nextProps.disabled;

			this.setState({
				focusedWhenDisabled
			});
		}

		componentDidUpdate (prevProps, prevState) {
			// if the component is focused and became disabled
			if (!prevState.focusedWhenDisabled && this.state.focusedWhenDisabled) {
				if (lastSelectTarget === this) {
					selectCancelled = true;
					forward('onMouseUp', null, this.props);
				}
			}

			// if the component became enabled, notify spotlight to enable restoring "lost" focus
			if (isSpottable(this.props) && !isSpottable(prevProps) && !Spotlight.isPaused()) {
				if (Spotlight.getPointerMode()) {
					if (this.isHovered) {
						Spotlight.setPointerMode(false);
						Spotlight.focus(this.node);
						Spotlight.setPointerMode(true);
					}
				} else if (!Spotlight.getCurrent()) {
					const containers = getContainersForNode(this.node);
					const containerId = Spotlight.getActiveContainer();
					if (containers.indexOf(containerId) >= 0) {
						Spotlight.focus(containerId);
					}
				}
			}
		}

		componentWillUnmount () {
			if (this.isFocused) {
				forward('onSpotlightDisappear', null, this.props);
			}
			if (lastSelectTarget === this) {
				lastSelectTarget = null;
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
				if (selectCancelled || (lastSelectTarget && lastSelectTarget !== this)) {
					return false;
				}
				lastSelectTarget = this;
			}
			return true;
		}

		forwardAndResetLastSelectTarget = (ev, props) => {
			const notPrevented = forwardWithPrevent('onKeyUp', ev, props);

			// bail early for non-enter keyup to avoid clearing lastSelectTarget prematurely
			if (!is('enter', ev.keyCode)) {
				return notPrevented;
			}

			const allow = lastSelectTarget === this;
			selectCancelled = false;
			lastSelectTarget = null;
			return notPrevented && allow;
		}

		isActionable = (ev, props) => isSpottable(props)

		handle = handle.bind(this)

		handleKeyDown = this.handle(
			forwardWithPrevent('onKeyDown'),
			this.forwardSpotlightEvents,
			this.isActionable,
			this.handleSelect,
			this.shouldEmulateMouse,
			forward('onMouseDown')
		)

		handleKeyUp = this.handle(
			this.forwardAndResetLastSelectTarget,
			this.isActionable,
			this.shouldEmulateMouse,
			forward('onMouseUp'),
			forward('onClick')
		)

		handleBlur = (ev) => {
			if (ev.currentTarget === ev.target) {
				this.isFocused = false;

				if (this.state.focusedWhenDisabled) {
					this.setState({focusedWhenDisabled: false});
				}
			}

			if (Spotlight.isMuted(ev.target)) {
				ev.stopPropagation();
			} else {
				forward('onBlur', ev, this.props);
			}
		}

		handleFocus = (ev) => {
			if (this.props.disabled) return;

			if (ev.currentTarget === ev.target) {
				this.isFocused = true;
			}

			if (Spotlight.isMuted(ev.target)) {
				ev.stopPropagation();
			} else {
				forward('onFocus', ev, this.props);
			}
		}

		handleEnter = (ev) => {
			forward('onMouseEnter', ev, this.props);
			if (hasPointerMoved(ev.clientX, ev.clientY)) {
				this.isHovered = true;
			}
		}

		handleLeave = (ev) => {
			forward('onMouseLeave', ev, this.props);
			if (hasPointerMoved(ev.clientX, ev.clientY)) {
				this.isHovered = false;
			}
		}

		render () {
			const {disabled, spotlightId, ...rest} = this.props;
			const spottable = this.state.focusedWhenDisabled || isSpottable(this.props);
			let tabIndex = rest.tabIndex;

			delete rest.onSpotlightDisappear;
			delete rest.onSpotlightDown;
			delete rest.onSpotlightLeft;
			delete rest.onSpotlightRight;
			delete rest.onSpotlightUp;
			delete rest.spotlightDisabled;

			if (tabIndex == null) {
				tabIndex = -1;
			}

			if (spottable) {
				if (rest.className) {
					rest.className += ' ' + spottableClass;
				} else {
					rest.className = spottableClass;
				}
			}

			if (spotlightId) {
				rest['data-spotlight-id'] = spotlightId;
			}

			return (
				<Wrapped
					{...rest}
					onBlur={this.handleBlur}
					onFocus={this.handleFocus}
					onMouseEnter={this.handleEnter}
					onMouseLeave={this.handleLeave}
					onKeyDown={this.handleKeyDown}
					onKeyUp={this.handleKeyUp}
					disabled={disabled}
					tabIndex={tabIndex}
				/>
			);
		}
	};
});

export default Spottable;
export {Spottable, spottableClass};
