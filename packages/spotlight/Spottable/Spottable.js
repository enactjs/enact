/**
 * Adds spottability to components.
 *
 * @module spotlight/Spottable
 * @exports Spottable
 * @exports spottableClass
 */

import handle, {forward, returnsTrue} from '@enact/core/handle';
import useHandlers from '@enact/core/useHandlers';
import hoc from '@enact/core/hoc';
import EnactPropTypes from '@enact/core/internal/prop-types';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {Component} from 'react';

import {spottableClass, useSpottable} from './useSpottable';

const
	forwardMouseDown = forward('onMouseDown'),
	forwardMouseUp = forward('onMouseUp'),
	forwardClick = forward('onClick'),
	forwardBlur = forward('onBlur'),
	forwardFocus = forward('onFocus'),
	forwardMouseEnter = forward('onMouseEnter'),
	forwardMouseLeave = forward('onMouseLeave'),
	forwardKeyDown = forward('onKeyDown'),
	forwardKeyUp = forward('onKeyUp');

const callContext = (name) => (ev, props, context) => context[name](ev, props);
const spotHandlers = {
	onKeyDown: handle(
		forwardKeyDown,
		callContext('onKeyDown'),
		forwardMouseDown
	),
	onKeyUp: handle(
		forwardKeyUp,
		callContext('onKeyUp'),
		forwardMouseUp,
		forwardClick
	),
	onBlur: handle(
		callContext('onBlur'),
		forwardBlur
	),
	onFocus: handle(
		callContext('onFocus'),
		forwardFocus
	),
	onMouseEnter: handle(
		returnsTrue((ev, props) => forwardMouseEnter(ev, props)),
		callContext('onMouseEnter')
	),
	onMouseLeave: handle(
		returnsTrue((ev, props) => forwardMouseLeave(ev, props)),
		callContext('onMouseLeave')
	)
};

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

	function SpottableBase (props) {
		const {
			className,
			disabled,
			handleForceUpdate,
			onSpotlightDisappear,
			onSpotlightDown,
			onSpotlightLeft,
			onSpotlightRight,
			onSpotlightUp,
			selectionKeys,
			spotlightDisabled,
			spotlightId,
			spotRef,
			...rest
		} = props;
		const spot = useSpottable({
			disabled,
			emulateMouse,
			handleForceUpdate,
			onSelectionCancel: rest.onMouseUp,
			onSpotlightDisappear,
			onSpotlightDown,
			onSpotlightLeft,
			onSpotlightRight,
			onSpotlightUp,
			selectionKeys,
			spotlightDisabled,
			spotlightId,
			spotRef
		});

		let tabIndex = rest.tabIndex;
		if (tabIndex == null) {
			tabIndex = -1;
		}
		rest.tabIndex = tabIndex;

		const handlers = useHandlers(spotHandlers, rest, spot);

		delete rest.spotlightId;

		return (
			<Wrapped
				{...rest}
				{...spot.attributes}
				{...handlers}
				className={classNames(className, spot.className)}
				disabled={disabled}
			/>
		);
	}

	SpottableBase.propTypes = /** @lends spotlight/Spottable.Spottable.prototype */ {
		/**
		 * Whether or not the component is in a disabled state.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * The handler to force update the component.
		 *
		 * @type {Function}
		 * @public
		 */
		handleForceUpdate: PropTypes.func,

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

		/*
		 * Called with a reference to spottable component
		 *
		 * @type {Object|Function}
		 * @private
		 */
		spotRef: EnactPropTypes.ref,

		/**
		 * The tabIndex of the component. This value will default to -1 if left
		 * unset and the control is spottable.
		 *
		 * @type {Number}
		 * @public
		 */
		tabIndex: PropTypes.number
	};

	// eslint-disable-next-line no-shadow
	class Spottable extends Component {
		componentDidMount () {
			this.forceUpdate();
		}

		handleForceUpdate = () => {
			this.forceUpdate();
		};

		get spotRef () {
			return this.node;
		}

		render () {
			return <SpottableBase {...this.props} handleForceUpdate={this.handleForceUpdate} spotRef={this.spotRef} />;
		}
	}

	return Spottable;
});

export default Spottable;
export {
	Spottable,
	spottableClass,
	useSpottable
};
