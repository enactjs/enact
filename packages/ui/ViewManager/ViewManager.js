/**
 * A component that manages the transitions of views.
 *
 * @module ui/ViewManager
 * @exports shape
 * @exports SlideArranger
 * @exports SlideBottomArranger
 * @exports SlideLeftArranger
 * @exports SlideRightArranger
 * @exports SlideTopArranger
 * @exports ViewManager
 * @exports ViewManagerBase
 * @exports ViewManagerDecorator
 */

import EnactPropTypes from '@enact/core/internal/prop-types';
import handle, {forwardCustom} from '@enact/core/handle';
import {checkPropTypes, setDefaultProps} from '@enact/core/util';
import PropTypes from 'prop-types';
import {Children, useCallback, useEffect, useMemo, useReducer} from 'react';

import ForwardRef from '../ForwardRef';

import {shape} from './Arranger';
import TransitionGroup from './TransitionGroup';
import {wrapWithView} from './View';

const viewManagerDefaultProps = {
	component: 'div',
	duration: 300,
	index: 0
};

const reducer = (state, action) => {
	switch (action.type) {
		case 'REVERSE':
			return {
				index: action.index,
				prevIndex: state.index,
				reverseTransition: action.reverseTransition
			};
		case 'UPDATE':
			return {
				index: action.index,
				prevIndex: state.index,
				reverseTransition: state.index > action.index
			};
		default:
			return state;
	}
};

/**
 * The base `ViewManager` component, without
 * {@link ui/ViewManager.ViewManagerDecorator|ViewManagerDecorator} applied.
 *
 * @class ViewManagerBase
 * @memberof ui/ViewManager
 * @ui
 * @public
 */
const ViewManagerBase = (componentProps) => {
	const props = useMemo(() => setDefaultProps(componentProps, viewManagerDefaultProps), [componentProps]);
	checkPropTypes(ViewManagerBase, props);

	const [state, dispatch] = useReducer(reducer, {prevIndex: null, reverseTransition: null});

	const {arranger, childProps, children, duration, index, noAnimation, enteringDelay, enteringProp, rtl, ...rest} = props;
	let {end = index, start = index} = props;
	const {prevIndex: previousIndex, reverseTransition} = state;
	const childrenList = Children.toArray(children);

	if (index > end) end = index;
	if (index < start) start = index;

	const childCount = end - start + 1;
	const size = (noAnimation || !arranger) ? childCount : childCount + 1;

	const views = childrenList.slice(start, start + childCount);
	const childFactory = useMemo(() => wrapWithView({
		arranger,
		duration,
		index,
		noAnimation,
		previousIndex,
		reverseTransition,
		enteringDelay,
		enteringProp,
		childProps,
		rtl: Boolean(rtl)
	}), [arranger, childProps, duration, index, noAnimation, previousIndex, reverseTransition, enteringDelay, enteringProp, rtl]);

	const makeTransitionEvent = useCallback(() => {
		return {index: props.index, previousIndex: state.prevIndex};
	}, [props.index, state.prevIndex]);

	const handleTransition = handle(
		forwardCustom('onTransition', makeTransitionEvent)
	).bindAs({props, context: {}}, 'handleTransition');

	const handleWillTransition = handle(
		forwardCustom('onWillTransition', makeTransitionEvent)
	).bindAs({props, context: {}}, 'handleWillTransition');

	if (props.reverseTransition != null) {
		if (props.reverseTransition !== state.reverseTransition || props.index !== state.index) {
			dispatch({
				type: 'REVERSE',
				index: props.index,
				reverseTransition: props.reverseTransition
			});
		}
	} else if (props.index !== state.index) {
		dispatch({
			type: 'UPDATE',
			index: props.index
		});
	}

	delete rest.end;
	delete rest.reverseTransition;
	delete rest.start;

	return (
		<TransitionGroup
			{...rest}
			childFactory={childFactory}
			currentIndex={index}
			onTransition={handleTransition}
			onWillTransition={handleWillTransition}
			size={size}
		>
			{views}
		</TransitionGroup>
	);
};

ViewManagerBase.displayName = 'ViewManager';
ViewManagerBase.propTypes = /** @lends ui/ViewManager.ViewManagerBase.prototype */ {
	/**
	 * Arranger to control the animation
	 *
	 * @type {Arranger}
	 */
	arranger: shape,

	/**
	 * An object containing properties to be passed to each child.
	 *
	 * @type {Object}
	 * @public
	 */
	childProps: PropTypes.object,

	/**
	 * Views to be managed.
	 *
	 * May be any renderable component including custom React components or primitive DOM nodes.
	 *
	 * @type {Node}
	 */
	children: PropTypes.node,

	/**
	 * Type of component wrapping the children. May be a DOM node or a custom React component.
	 *
	 * @type {String|Component}
	 * @default 'div'
	 */
	component: EnactPropTypes.renderable,

	/**
	 * Called with a reference to the root component.
	 *
	 * When using {@link ui/ViewManager.ViewManager}, the `ref` prop is forwarded to this
	 * component as `componentRef`.
	 *
	 * @type {Object|Function}
	 * @public
	 */
	componentRef: EnactPropTypes.ref,

	/**
	 * Time in milliseconds to complete a transition
	 *
	 * @type {Number}
	 * @default 300
	 */
	duration: PropTypes.number,

	/**
	 * Index of last visible view.
	 *
	 * Defaults to the current value of `index`.
	 *
	 * @type {Number}
	 * @default value of index
	 */
	end: PropTypes.number,

	/**
	 * Time, in milliseconds, to wait after a view has entered to inform it by pass the
	 * `enteringProp` as false.
	 *
	 * @type {Number}
	 * @default 0
	 */
	enteringDelay: PropTypes.number,

	/**
	 * Name of the property to pass to the wrapped view to indicate when it is entering the
	 * viewport.
	 *
	 * When `true`, the view has been created but has not transitioned into place.
	 * When `false`, the view has finished its transition.
	 *
	 * The notification can be delayed by setting `enteringDelay`. If not set, the view will not
	 * be notified of the change in transition.
	 *
	 * @type {String}
	 */
	enteringProp: PropTypes.string,

	/**
	 * Index of active view
	 *
	 * @type {Number}
	 * @default 0
	 */
	index: PropTypes.number,

	/**
	 * Indicates if the transition should be animated
	 *
	 * @type {Boolean}
	 * @default false
	 */
	noAnimation: PropTypes.bool,

	/**
	 * Called when each view is rendered during initial construction.
	 *
	 * @type {Function}
	 */
	onAppear: PropTypes.func,

	/**
	 * Called when each view completes its transition into the viewport.
	 *
	 * @type {Function}
	 */
	onEnter: PropTypes.func,

	/**
	 * Called when each view completes its transition out of the viewport.
	 *
	 * @type {Function}
	 */
	onLeave: PropTypes.func,

	/**
	 * Called when each view completes its transition within the viewport.
	 *
	 * @type {Function}
	 */
	onStay: PropTypes.func,

	/**
	 * Called once when all views have completed their transition.
	 *
	 * @type {Function}
	 */
	onTransition: PropTypes.func,

	/**
	 * Called once before views begin their transition.
	 *
	 * @type {Function}
	 */
	onWillTransition: PropTypes.func,

	/**
	 * Explicitly sets the transition direction.
	 *
	 * If omitted, the direction is determined automatically based on the change of index or a
	 * string comparison of the first child's key.
	 *
	 * @type {Boolean}
	 */
	reverseTransition: PropTypes.bool,

	/**
	 * Indicates the current locale uses right-to-left reading order.
	 *
	 * `rtl` is passed to the `arranger` in order to alter the animation (e.g. reversing the
	 * horizontal direction).
	 *
	 * @type {Boolean}
	 */
	rtl: PropTypes.bool,

	/**
	 * Index of first visible view. Defaults to the current value of `index`.
	 *
	 * @type {Number}
	 * @default value of index
	 */
	start: PropTypes.number
};

/**
 * Applies ViewManager behaviors.
 *
 * @hoc
 * @memberof ui/ViewManager
 * @mixes ui/ForwardRef.ForwardRef
 * @public
 */
const ViewManagerDecorator = ForwardRef({prop: 'componentRef'});

/**
 * A `ViewManager` controls the visibility of a configurable number of views, allowing for them to be
 * transitioned on and off the viewport.
 *
 * @class ViewManager
 * @memberof ui/ViewManager
 * @extends ui/ViewManager.ViewManagerBase
 * @mixes ui/ViewManager.ViewManagerDecorator
 * @omit componentRef
 * @ui
 * @public
 */
const ViewManager = ViewManagerDecorator(ViewManagerBase);

export default ViewManager;
export {
	ViewManager,
	ViewManagerBase,
	ViewManagerDecorator
};
export * from './Arranger';
