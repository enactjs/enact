/*
 * Exports the {@link ui/ViewManager.TransitionGroup} component.
 */

// Using string refs from the source code of ReactTransitionGroup
/* eslint-disable react/no-string-refs */

import compose from '@enact/core/internal/fp/compose';
import {forward} from '@enact/core/handle';
import PropTypes from 'prop-types';
import eqBy from 'ramda/src/eqBy';
import equals from 'ramda/src/equals';
import findIndex from 'ramda/src/findIndex';
import identity from 'ramda/src/identity';
import lte from 'ramda/src/lte';
import map from 'ramda/src/map';
import prop from 'ramda/src/prop';
import propEq from 'ramda/src/propEq';
import remove from 'ramda/src/remove';
import sort from 'ramda/src/sort';
import unionWith from 'ramda/src/unionWith';
import useWith from 'ramda/src/useWith';
import when from 'ramda/src/when';
import React from 'react';

const orderedKeys = map(when(React.isValidElement, prop('key')));
const unorderedKeys = compose(sort((a, b) => a - b), orderedKeys);
const unorderedEquals = useWith(equals, [unorderedKeys, unorderedKeys]);
const orderedEquals = useWith(equals, [orderedKeys, orderedKeys]);

/**
 * Compares the keys of two sets of children and returns `true` if they are equal.
 *
 * @method
 * @memberof core/util
 * @param  {Node[]}		prev		Array of children
 * @param  {Node[]}		next		Array of children
 * @param  {Boolean}	[ordered]	`true` to require the same order
 *
 * @returns {Boolean}				`true` if the children are the same
 */
const childrenEquals = (prev, next, ordered = false) => {
	const prevChildren = React.Children.toArray(prev);
	const nextChildren = React.Children.toArray(next);

	if (prevChildren.length !== nextChildren.length) {
		return false;
	} else if (prevChildren.length === 1 && nextChildren.length === 1) {
		const c1 = prevChildren[0];
		const c2 = nextChildren[0];

		return equals(c1, c2);
	} else if (ordered) {
		return orderedEquals(prevChildren, nextChildren);
	} else {
		return unorderedEquals(prevChildren, nextChildren);
	}
};

/**
 * Returns the index of a child in an array found by `key` matching
 *
 * @param {Object} child React element to find
 * @param {Object[]} children Array of React elements
 * @returns {Number} Index of child
 * @method
 * @private
 */
const indexOfChild = useWith(findIndex, [propEq('key'), identity]);

/**
 * Returns `true` if `children` contains `child`
 *
 * @param {Object} child React element to find
 * @param {Object[]} children Array of React elements
 * @returns {Boolean} `true` if `child` is present
 * @method
 * @private
 */
const hasChild = compose(lte(0), indexOfChild);

/**
 * Returns an array of non-null children
 *
 * @param  {Object[]} children Array of React children
 *
 * @returns {Object[]}          Array of children
 * @private
 */
const mapChildren = function (children) {
	const result = children && React.Children.toArray(children);
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
const forwardOnTransition = forward('onTransition');
const forwardOnWillTransition = forward('onWillTransition');

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

class TransitionGroup extends React.Component {
	static propTypes = /** @lends ui/ViewManager.TransitionGroup.prototype */ {
		children: PropTypes.node.isRequired,

		/**
		 * Adapts children to be compatible with TransitionGroup
		 *
		 * @type {Function}
		 */
		childFactory: PropTypes.func,

		/**
		 * Type of component wrapping the children. May be a DOM node or a custom React component.
		 *
		 * @type {String|Component}
		 * @default 'div'
		 */
		component: PropTypes.any,

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
		 * Maximum number of rendered children. Used to limit how many visible transitions are
		 * active at any time. A value of 1 would prevent any exit transitions whereas a value of 2,
		 * the default, would ensure that only 1 view is transitioning on and 1 view is
		 * transitioning off at a time.
		 *
		 * @type {Number}
		 * @default 2
		 */
		size: PropTypes.number
	}

	static defaultProps = {
		childFactory: identity,
		component: 'div',
		size: 2
	}

	constructor (props) {
		super(props);
		this.state = {
			children: mapChildren(this.props.children)
		};
	}

	componentWillMount () {
		this.currentlyTransitioningKeys = {};
		this.keysToEnter = [];
		this.keysToLeave = [];
		this.keysToStay = [];
	}

	componentDidMount () {
		// this isn't used by ViewManager or View at the moment but leaving it around for future
		// flexibility
		this.state.children.forEach(child => this.performAppear(child.key));
	}

	componentWillReceiveProps (nextProps) {
		// Avoid an unnecessary setState and reconcileChildren if the children haven't changed
		if (!childrenEquals(this.props.children, nextProps.children)) {
			const nextChildMapping = mapChildren(nextProps.children);
			const prevChildMapping = this.state.children;
			let children = mergeChildren(nextChildMapping, prevChildMapping);

			// drop children exceeding allowed size
			const dropped = children.length > nextProps.size ? children.splice(nextProps.size) : null;

			this.setState({
				children
			}, () => {
				this.reconcileChildren(dropped, prevChildMapping, nextChildMapping);
			});
		}
	}

	reconcileChildren (dropped, prevChildMapping, nextChildMapping) {
		// mark any new child as entering
		nextChildMapping.forEach(child => {
			const key = child.key;
			const hasPrev = hasChild(key, prevChildMapping);
			const isDropped = dropped && hasChild(key, dropped);
			// flag a view to enter if it isn't being dropped, if it's new (!hasPrev), or if it's
			// not new (hasPrev) but is re-entering (is currently transitioning)
			if (!isDropped) {
				if (!hasPrev || this.currentlyTransitioningKeys[key]) {
					this.keysToEnter.push(key);
				} else {
					this.keysToStay.push(key);
				}
			}
		});

		// mark any previous child not remaining as leaving
		prevChildMapping.forEach(child => {
			const key = child.key;
			const hasNext = hasChild(key, nextChildMapping);
			const isDropped = dropped && hasChild(key, dropped);
			// flag a view to leave if it isn't being dropped and it isn't in the new set (!hasNext)
			if (!isDropped && !hasNext) {
				this.keysToLeave.push(key);
			}
		});

		// if any views were dropped because they exceeded `size`, the can no longer be
		// transitioning so indicate as such
		if (dropped) {
			dropped.forEach(child => {
				delete this.currentlyTransitioningKeys[child.key];
			});
		}

		if (this.keysToEnter.length) {
			forwardOnWillTransition(null, this.props);
		}

		// once the component has been updated, start the enter transition for new children,
		const keysToEnter = this.keysToEnter;
		this.keysToEnter = [];
		keysToEnter.forEach(this.performEnter);

		// ... the stay transition for any children remaining,
		const keysToStay = this.keysToStay;
		this.keysToStay = [];
		keysToStay.forEach(this.performStay);

		// ... and the leave transition for departing children
		const keysToLeave = this.keysToLeave;
		this.keysToLeave = [];
		keysToLeave.forEach(this.performLeave);
	}

	completeTransition (key) {
		delete this.currentlyTransitioningKeys[key];

		if (Object.keys(this.currentlyTransitioningKeys).length === 0) {
			forwardOnTransition(null, this.props);
		}
	}

	performAppear = (key) => {
		this.currentlyTransitioningKeys[key] = true;

		const component = this.refs[key];

		if (component.componentWillAppear) {
			component.componentWillAppear(
				this._handleDoneAppearing.bind(this, key)
			);
		} else {
			this._handleDoneAppearing(key);
		}
	}

	_handleDoneAppearing = (key) => {
		const component = this.refs[key];
		if (component.componentDidAppear) {
			component.componentDidAppear();
		}

		forwardOnAppear({
			view: component
		}, this.props);

		this.completeTransition(key);

		let currentChildMapping = mapChildren(this.props.children);

		if (!currentChildMapping || !hasChild(key, currentChildMapping)) {
			// This was removed before it had fully appeared. Remove it.
			this.performLeave(key);
		}
	}

	performEnter = (key) => {
		this.currentlyTransitioningKeys[key] = true;

		const component = this.refs[key];

		if (component.componentWillEnter) {
			component.componentWillEnter(
				this._handleDoneEntering.bind(this, key)
			);
		} else {
			this._handleDoneEntering(key);
		}
	}

	_handleDoneEntering = (key) => {
		const component = this.refs[key];
		if (component.componentDidEnter) {
			component.componentDidEnter();
		}

		forwardOnEnter({
			view: component
		}, this.props);

		this.completeTransition(key);
	}

	performStay = (key) => {
		const component = this.refs[key];

		if (component.componentWillStay) {
			component.componentWillStay(
				this._handleDoneStaying.bind(this, key)
			);
		} else {
			this._handleDoneStaying(key);
		}
	}

	_handleDoneStaying = (key) => {
		const component = this.refs[key];
		if (component.componentDidStay) {
			component.componentDidStay();
		}

		forwardOnStay({
			view: component
		}, this.props);
	}

	performLeave = (key) => {
		this.currentlyTransitioningKeys[key] = true;

		const component = this.refs[key];
		if (component.componentWillLeave) {
			component.componentWillLeave(this._handleDoneLeaving.bind(this, key));
		} else {
			// Note that this is somewhat dangerous b/c it calls setState()
			// again, effectively mutating the component before all the work
			// is done.
			this._handleDoneLeaving(key);
		}
	}

	_handleDoneLeaving = (key) => {
		const component = this.refs[key];

		if (component.componentDidLeave) {
			component.componentDidLeave();
		}

		forwardOnLeave({
			view: component
		}, this.props);

		this.completeTransition(key);

		this.setState(function (state) {
			const index = indexOfChild(key, state.children);
			return {children: remove(index, 1, state.children)};
		});
	}

	render () {
		// support wrapping arbitrary children with a component that supports the necessary
		// lifecycle methods to animate transitions
		const childrenToRender = this.state.children.map(child => {
			const isLeaving = child.props['data-index'] !== this.props.currentIndex && typeof child.props['data-index'] !== 'undefined';

			return React.cloneElement(
				this.props.childFactory(child),
				{key: child.key, ref: child.key, leaving: isLeaving}
			);
		});

		// Do not forward TransitionGroup props to primitive DOM nodes
		const props = Object.assign({}, this.props);
		delete props.size;
		delete props.childFactory;
		delete props.currentIndex;
		delete props.component;
		delete props.onAppear;
		delete props.onAppear;
		delete props.onEnter;
		delete props.onLeave;
		delete props.onStay;
		delete props.onTransition;
		delete props.onWillTransition;

		return React.createElement(
			this.props.component,
			props,
			childrenToRender
		);
	}
}

export default TransitionGroup;
export {TransitionGroup};
