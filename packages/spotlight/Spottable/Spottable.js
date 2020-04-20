/**
 * Adds spottability to components.
 *
 * @module spotlight/Spottable
 * @exports Spottable
 * @exports spottableClass
 */

import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import Spot from './Spot';

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

const isSpottable = (props) => !props.spotlightDisabled;

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
	 * @default true
	 * @public
	 * @memberof spotlight/Spottable.Spottable.defaultConfig
	 */
	emulateMouse: true
};

/**
 * Constructs a Spotlight 5-way navigation-enabled higher-order component.
 *
 * Note: This HoC passes a number of props to the wrapped component that should be passed to the
 * main DOM node.
 *
 * Example:
 * ```
 *	const Component = ({myProp, ...rest}) => (
 *		<div {...rest}>{myProp}</div>
 *	);
 *	...
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
			 * An array of numbers representing keyCodes that should trigger mouse event
			 * emulation when `emulateMouse` is `true`. If a keyCode equals a directional
			 * key, then default 5-way navigation will be prevented when that key is pressed.
			 *
			 * @type {Number[]}
			 * @default [13, 16777221]
			 * @public
			 */
			selectionKeys: PropTypes.arrayOf(PropTypes.number),

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

		static defaultProps = {
			selectionKeys: [ENTER_KEY, REMOTE_OK_KEY]
		}

		constructor (props) {
			super(props);

			this.spot = new Spot({emulateMouse, ...props});
		}

		componentDidMount () {
			// eslint-disable-next-line react/no-find-dom-node
			this.spot.componentDidMount(ReactDOM.findDOMNode(this));
		}

		componentDidUpdate (prevProps) {
			this.spot.componentDidUpdate(prevProps);
		}

		componentWillUnmount () {
			this.spot.componentWillUnmount();
		}

		render () {
			const {disabled, spotlightId, spotlightDisabled, ...rest} = this.props;

			this.spot.render({spotlightDisabled});

			const spottable = this.spot.focusedWhenDisabled || isSpottable(this.props);

			let tabIndex = rest.tabIndex;

			delete rest.onSpotlightDisappear;
			delete rest.onSpotlightDown;
			delete rest.onSpotlightLeft;
			delete rest.onSpotlightRight;
			delete rest.onSpotlightUp;
			delete rest.selectionKeys;
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
					onBlur={this.spot.handleBlur.bind(this.spot)}
					onFocus={this.spot.handleFocus.bind(this.spot)}
					onMouseEnter={this.spot.handleEnter.bind(this.spot)}
					onMouseLeave={this.spot.handleLeave.bind(this.spot)}
					onKeyDown={this.spot.handleKeyDown.bind(this.spot)}
					onKeyUp={this.spot.handleKeyUp.bind(this.spot)}
					disabled={disabled}
					tabIndex={tabIndex}
				/>
			);
		}
	};
});

export default Spottable;
export {Spottable, spottableClass};
