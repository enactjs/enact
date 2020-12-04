/**
 * Adds spottability to components.
 *
 * @module spotlight/Spottable
 * @exports Spottable
 * @exports spottableClass
 */

import {adaptEvent, forward, returnsTrue} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import EnactPropTypes from '@enact/core/internal/prop-types';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import {spottableClass, useSpot} from './useSpot';

const
	forwardMouseDown = forward('onMouseDown'),
	forwardMouseUp = forward('onMouseUp'),
	forwardClick = forward('onClick'),
	forwardBlur = forward('onBlur'),
	forwardFocus = forward('onFocus'),
	forwardMouseEnter = forward('onMouseEnter'),
	forwardMouseLeave = forward('onMouseLeave');
const
	forwardKeyDownWithPrevent = forward('onKeyDown'),
	forwardKeyUpWithPrevent = forward('onKeyUp');

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
	const handleWithProps = (props) => (...handlers) => (ev) => {
		handlers.reduce((ret, fn) => (ret && fn(ev, props) || false), true);
	};

	function SpottableBase (props) {
		const {
			className,
			componentRef,
			disabled,
			onSpotlightDisappear,
			onSpotlightDown,
			onSpotlightLeft,
			onSpotlightRight,
			onSpotlightUp,
			selectionKeys,
			spotlightDisabled,
			spotlightId,
			...rest
		} = props;
		const spot = useSpot({
			componentRef,
			disabled,
			emulateMouse,
			onSelectionCancel: rest.onMouseUp,
			onSpotlightDisappear,
			onSpotlightDown,
			onSpotlightLeft,
			onSpotlightRight,
			onSpotlightUp,
			selectionKeys,
			spotlightDisabled
		});
		const handle = handleWithProps(props);

		let tabIndex = rest.tabIndex;
		if (tabIndex == null) {
			tabIndex = -1;
		}
		rest.tabIndex = tabIndex;

		if (spotlightId) {
			rest['data-spotlight-id'] = spotlightId;
		}

		rest.onKeyDown = handle(
			forwardKeyDownWithPrevent,
			spot.keyDown,
			forwardMouseDown
		);
		rest.onKeyUp = handle(
			adaptEvent(
				(ev, props) => ({notPrevented: forwardKeyUpWithPrevent(ev, props), ...ev}), // eslint-disable-line no-shadow
				spot.keyUp
			),
			forwardMouseUp,
			forwardClick
		);
		rest.onBlur = handle(
			spot.blur,
			forwardBlur
		);
		rest.onFocus = handle(
			spot.focus,
			forwardFocus
		);
		rest.onMouseEnter = handle(
			returnsTrue((ev) => forwardMouseEnter(ev, props)),
			spot.mouseEnter
		);
		rest.onMouseLeave = handle(
			returnsTrue((ev) => forwardMouseLeave(ev, props)),
			spot.mouseLeave
		);

		return (
			<Wrapped
				{...rest}
				className={classNames(className, spot.className)}
				disabled={disabled}
			/>
		);
	}

	SpottableBase.propTypes = /** @lends spotlight/Spottable.Spottable.prototype */ {
		/*
		 * Called with a reference to [component]{@link spotlight/Spottable.Spottable#component}
		 *
		 * @type {Object|Function}
		 * @private
		 */
		componentRef: EnactPropTypes.ref,

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
	};

	// eslint-disable-next-line no-shadow
	class Spottable extends React.Component {
		componentDidMount () {
			// eslint-disable-next-line react/no-find-dom-node
			this.node = ReactDOM.findDOMNode(this);
		}

		get componentRef () {
			return this.node;
		}

		render () {
			return <SpottableBase {...this.props} componentRef={this.componentRef} />;
		}
	}

	return Spottable;
});

export default Spottable;
export {
	Spottable,
	spottableClass,
	useSpot
};
