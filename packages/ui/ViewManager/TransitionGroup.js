/*
 * Exports the {@link ui/ViewManager.TransitionGroup} component.
 */

// Using string refs from the source code of ReactTransitionGroup

import EnactPropTypes from '@enact/core/internal/prop-types';
import {forward, forwardCustom} from '@enact/core/handle';
import {checkPropTypes, setDefaultProps, usePrevious} from '@enact/core/util';
import PropTypes from 'prop-types';
import eqBy from 'ramda/src/eqBy';
import findIndex from 'ramda/src/findIndex';
import identity from 'ramda/src/identity';
import prop from 'ramda/src/prop';
import propEq from 'ramda/src/propEq';
import remove from 'ramda/src/remove';
import unionWith from 'ramda/src/unionWith';
import useWith from 'ramda/src/useWith';
import {
	Children,
	cloneElement,
	createElement,
	useEffect,
	useRef,
	useCallback,
	useMemo,
	useReducer
} from 'react';

/**
 * Returns the index of a child in an array found by `key` matching
 *
 * @param {Object} child React element to find
 * @param {Object[]} children Array of React elements
 * @returns {Number} Index of child
 * @method
 * @private
 */
// eslint-disable-next-line react-hooks/rules-of-hooks
const indexOfChild = useWith(findIndex, [propEq('key'), identity]);

/**
 * Returns an array of non-null children
 *
 * @param  {Object[]} children Array of React children
 *
 * @returns {Object[]}          Array of children
 * @private
 */
const mapChildren = function (children) {
	const result = children && Children.toArray(children);
	return result ? result.filter(c => !!c) : [];
};

/**
 * Merges two arrays of children without any duplicates (by `key`)
 *
 * @param {Object[]} a Set of children
 * @param {Object[]} b Set of children
 * @returns {Object[]} Merged set of children
 * @method
 * @private
 */
const mergeChildren = unionWith(eqBy(prop('key')));

// Cached event forwarders
const forwardOnAppear = forward('onAppear');
const forwardOnEnter = forward('onEnter');
const forwardOnLeave = forward('onLeave');
const forwardOnStay = forward('onStay');

const transitionGroupDefaultProps = {
	childFactory: identity,
	component: 'div',
	size: 2
};

const reducer = (state, action) => {
	switch (action.type) {
		case 'INIT':
			return {
				activeChildren: action.children,
				children: action.children,
				firstRender: false
			};
		case 'UPDATE':
			return {
				...state,
				activeChildren: action.children,
				children: action.mergedChildren
			};
		case 'REMOVE_CHILD':
			return {
				...state,
				children: remove(indexOfChild(action.key, state.children), 1, state.children)
			};
		default:
			return state;
	}
};

/**
 * Manages the transition of added and removed child components. Children that are added are
 * transitioned in and those removed are transition out via optional callbacks on the child.
 *
 * Ported from [ReactTransitionGroup]
 * (https://facebook.github.io/react/docs/animation.html#low-level-api-reacttransitiongroup).
 * Currently somewhat specialized for the purposes of ViewManager.
 *
 * @class TransitionGroup
 * @memberof ui/ViewManager
 * @private
 */

const TransitionGroup = (componentProps) => {
	const props = useMemo(() => setDefaultProps(componentProps, transitionGroupDefaultProps), [componentProps]);
	const {childFactory, currentIndex} = props;

	const [state, dispatch] = useReducer(reducer, {children: [], firstRender: true});

	const hasMounted = useRef(false);
	const nodeRef = useRef(null);
	const groupRefs = useRef({});
	const currentlyTransitioningKeys = useRef({});
	const keysToEnter = useRef([]);
	const keysToLeave = useRef([]);
	const keysToStay = useRef([]);
	const refNodeId = '#transition#group#';

	const prevState = usePrevious(state);

	const completeTransition = useCallback(({key, noForwarding = false}) => {
		if (key in currentlyTransitioningKeys.current) {
			delete currentlyTransitioningKeys.current[key];

			if (!noForwarding && Object.keys(currentlyTransitioningKeys.current).length === 0) {
				forwardCustom('onTransition')(null, props);
			}
		}
	},  [props]);

	const _handleDoneLeaving = useCallback((key) => {
		const component = groupRefs.current[key];

		if (component.componentDidLeave) {
			component.componentDidLeave();
		}

		forwardOnLeave({
			type: 'onLeave',
			view: component
		}, props);

		completeTransition({key});

		dispatch({type: 'REMOVE', key});
	}, [completeTransition, props]);

	const performLeave = useCallback((key) => {
		currentlyTransitioningKeys.current[key] = true;

		const component = groupRefs.current[key];
		if (component.componentWillLeave) {
			component.componentWillLeave(() => _handleDoneLeaving(key));
		} else {
			// Note that this is somewhat dangerous b/c it calls setState()
			// again, effectively mutating the component before all the work
			// is done.
			_handleDoneLeaving(key);
		}
	}, [_handleDoneLeaving]);

	const _handleDoneAppearing = useCallback((key) => {
		const component = groupRefs.current[key];
		if (component.componentDidAppear) {
			component.componentDidAppear();
		}

		forwardOnAppear({
			type: 'onAppear',
			view: component
		}, props);

		completeTransition({key, noForwarding: true});

		let currentChildMapping = mapChildren(props.children);

		if (!currentChildMapping || !currentChildMapping.find(child => child.key === key)) {
			// This was removed before it had fully appeared. Remove it.
			performLeave(key);
		}
	}, [completeTransition, performLeave, props]);

	const performAppear = useCallback((key) => {
		currentlyTransitioningKeys.current[key] = true;

		const component = groupRefs.current[key];

		if (component.componentWillAppear) {
			component.componentWillAppear(() => _handleDoneAppearing(key));
		} else {
			_handleDoneAppearing(key);
		}
	}, [_handleDoneAppearing]);

	const _handleDoneEntering = useCallback((key) => {
		const component = groupRefs.current[key];
		if (component.componentDidEnter) {
			component.componentDidEnter();
		}

		forwardOnEnter({
			type: 'onEnter',
			view: component
		}, props);

		completeTransition({key});
	}, [completeTransition, props]);

	const performEnter = useCallback((key) => {
		currentlyTransitioningKeys.current[key] = true;

		const component = groupRefs.current[key];

		if (component.componentWillEnter) {
			component.componentWillEnter(() => _handleDoneEntering(key));
		} else {
			_handleDoneEntering(key);
		}
	}, [_handleDoneEntering]);

	const _handleDoneStaying = useCallback((key) => {
		const component = groupRefs.current[key];
		if (component.componentDidStay) {
			component.componentDidStay();
		}

		forwardOnStay({
			type: 'onStay',
			view: component
		}, props);
	}, [props]);

	const performStay = useCallback((key) => {
		const component = groupRefs.current[key];

		if (component.componentWillStay) {
			component.componentWillStay(() => _handleDoneStaying(key));
		} else {
			_handleDoneStaying(key);
		}
	}, [_handleDoneStaying]);

	const reconcileUnmountedChildren = useCallback((prevChildMapping, nextChildMapping) => {
		if (!prevChildMapping || !nextChildMapping) {
			return;
		}
		const nextChildKeys = nextChildMapping.map(c => c.key);
		const prevChildKeys = prevChildMapping.map(c => c.key);

		// `state.children` represents the mounted children. if a view change happens during a
		// transition causing the View to be unmounted before it fires its callback, the
		// currentlyTransitioningKeys map will be out of sync. To manage that, we check for keys
		// that have fallen out of the `children` array and manually clean them up from the map.
		prevChildKeys
			.filter(key => !nextChildKeys.includes(key))
			.forEach(key => completeTransition({key}));
	}, [completeTransition]);

	const reconcileChildren = useCallback((prevActiveChildMapping, nextActiveChildMapping) => {
		if (!prevActiveChildMapping || !nextActiveChildMapping) {
			return;
		}
		const {size} = props;

		const nextChildKeys = nextActiveChildMapping.map(c => c.key);
		const prevChildKeys = prevActiveChildMapping.map(c => c.key);
		const droppedKeys = prevChildKeys.filter(key => !nextChildKeys.includes(key));

		// if children haven't changed, there's nothing to reconcile
		if (prevActiveChildMapping.length === nextActiveChildMapping.length && droppedKeys.length === 0) {
			return;
		}

		// remove any "dropped" children from the list of transitioning children
		droppedKeys.forEach((key) => completeTransition({key}));

		// mark any new child as entering
		nextChildKeys.forEach((key, index) => {
			const hasPrev = prevChildKeys.includes(key);

			if (!hasPrev || currentlyTransitioningKeys.current[key]) {
				// flag a view to enter if it's new (!hasPrev), or if it's not new (hasPrev) but is
				// re-entering (is currently transitioning)
				keysToEnter.current.push(key);
			} else if (index < size - 1) {
				// keep views that are less than size minus the "transition out" buffer
				keysToStay.current.push(key);
			} else {
				// everything else is leaving
				keysToLeave.current.push(key);
			}
		});

		// mark any previous child not remaining as leaving
		prevChildKeys.forEach(key => {
			const hasNext = nextChildKeys.includes(key);
			const isRendered = Boolean(groupRefs.current[key]);
			// flag a view to leave if it isn't in the new set (!hasNext) and it exists (isRendered)
			if (!hasNext && isRendered) {
				keysToLeave.current.push(key);
			}
		});

		if (keysToEnter.current.length || keysToLeave.current.length) {
			forwardCustom('onWillTransition')(null, props);
		}

		// once the component has been updated, start the enter transition for new children,
		const localKeysToEnter = keysToEnter.current;
		keysToEnter.current = [];
		localKeysToEnter.forEach(performEnter);

		// ... the stay transition for any children remaining,
		const localKeysToStay = keysToStay.current;
		keysToStay.current = [];
		localKeysToStay.forEach(performStay);

		// ... and the leave transition for departing children
		const localKeysToLeave = keysToLeave.current;
		keysToLeave.current = [];
		localKeysToLeave.forEach(performLeave);
	}, [completeTransition, performEnter, performLeave, performStay, props]);

	const children = useMemo(() => mapChildren(props.children).slice(0, props.size), [props.children, props.size]);
	const mergedChildren = useMemo(() => mergeChildren(children, state.children).slice(0, props.size), [children, state.children, props.size]);

	if (state.firstRender) {
		dispatch({type: 'INIT', children});
	}

	if (state.activeChildren && state.activeChildren !== children) {
		dispatch({type: 'UPDATE', children, mergedChildren});
	}

	useEffect(() => {
		hasMounted.current = true;
		// this isn't used by ViewManager or View at the moment but leaving it around for future
		// flexibility
		state.children.forEach(child => performAppear(child.key));
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		reconcileUnmountedChildren(prevState.children, state.children);
		reconcileChildren(prevState.activeChildren, state.activeChildren);
	}, [prevState.activeChildren, prevState.children, reconcileChildren, reconcileUnmountedChildren, state.activeChildren, state.children]);

	useEffect(() => {
		checkPropTypes(TransitionGroup, componentProps);
	}, [componentProps]);

	const storeRefs = useCallback((key) => (node) => {
		groupRefs.current[key] = node;
	}, []);

	/* This code is the same as @enact/core/WithRef. */
	const getNodeRef = useCallback(() => {
		const refNode = nodeRef.current;
		const attributeSelector = `[data-transitiongroup-id="${refNode.getAttribute('data-transitiongroup-target')}"]`;
		/* The intended code is to search for the referrer element via a single querySelector call. But unit tests cannot handle :has() properly.
		const selector = `:scope ${attributeSelector}, :scope :has(${attributeSelector})`;
		return refNode?.parentElement?.querySelector(selector) || null;
		*/
		const targetNode = refNode?.parentElement?.querySelector(attributeSelector) || null;
		for (let current = targetNode; current; current = current.parentElement) {
			if (current?.parentElement === refNode?.parentElement) {
				return current;
			}
		}
	}, []);

	// support wrapping arbitrary children with a component that supports the necessary
	// lifecycle methods to animate transitions
	// eslint-disable-next-line react-hooks/refs
	const childrenToRender = useMemo(() => state.children.map((child, index) => {
		const isLeaving = child.props['data-index'] !== currentIndex && typeof child.props['data-index'] !== 'undefined';

		return cloneElement(
			childFactory(child),
			{
				key: child.key,
				ref: storeRefs(child.key),
				leaving: isLeaving,
				appearing: !hasMounted.current,
				getParentRef: getNodeRef,
				renderedIndex: index
			});
	}), [childFactory, currentIndex, getNodeRef, state.children, storeRefs]);

	// Do not forward TransitionGroup props to primitive DOM nodes
	const forwardProps = Object.assign({}, props);

	forwardProps.ref = props.componentRef;
	forwardProps['data-transitiongroup-id'] = refNodeId;

	delete forwardProps.childFactory;
	delete forwardProps.component;
	delete forwardProps.componentRef;
	delete forwardProps.currentIndex;
	delete forwardProps.onAppear;
	delete forwardProps.onEnter;
	delete forwardProps.onLeave;
	delete forwardProps.onStay;
	delete forwardProps.onTransition;
	delete forwardProps.onWillTransition;
	delete forwardProps.size;

	return (
		<>
			{createElement(props.component, forwardProps, childrenToRender)}
			<div data-transitiongroup-target={refNodeId} ref={nodeRef} style={{display: 'none'}} />
		</>
	);
};

TransitionGroup.propTypes = /** @lends ui/ViewManager.TransitionGroup.prototype */ {
	children: PropTypes.node.isRequired,

	/**
	 * Adapts children to be compatible with TransitionGroup
	 *
	 * @type {Function}
	 */
	childFactory: PropTypes.func,

	/**
	 * Type of component wrapping the children.
	 *
	 * May be a DOM node or a custom React component.
	 *
	 * @type {String|Component}
	 * @default 'div'
	 */
	component: EnactPropTypes.renderable,

	/**
	 * Called with a reference to {@link ui/ViewManager.TransitionGroup.component|component}
	 *
	 * @type {Object|Function}
	 * @private
	 */
	componentRef: EnactPropTypes.ref,

	/**
	 * Current Index the ViewManager is on
	 *
	 * @type {Number}
	 */
	currentIndex: PropTypes.number,

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
	 * Maximum number of rendered children.
	 *
	 * Used to limit how many visible transitions are active at any time.
	 * A value of 1 would prevent any exit transitions whereas a value of 2,
	 * the default, would ensure that only 1 view is transitioning on and 1 view is
	 * transitioning off at a time.
	 *
	 * @type {Number}
	 * @default 2
	 */
	size: PropTypes.number
};

export default TransitionGroup;
export {TransitionGroup};
