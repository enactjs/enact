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
 */

import React from 'react';
import PropTypes from 'prop-types';

import {shape} from './Arranger';
import TransitionGroup from './TransitionGroup';
import {wrapWithView} from './View';

/**
 * A `ViewManager` controls the visibility of a configurable number of views, allowing for them to be
 * transitioned on and off the viewport.
 *
 * @class ViewManager
 * @ui
 * @memberof ui/ViewManager
 * @public
 */
class ViewManager extends React.Component {

	static propTypes = /** @lends ui/ViewManager.ViewManager.prototype */ {
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
		 * @type {Component}
		 * @default 'div'
		 */
		component: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.string
		]),

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
		 * If omitted, the direction is determined automaticallly based on the change of index or a
		 * string comparison of the first child's key.
		 *
		 * @type {Boolean}
		 */
		reverseTransition: PropTypes.bool,

		/**
		 * Index of first visible view. Defaults to the current value of `index`.
		 *
		 * @type {Number}
		 * @default value of index
		 */
		start: PropTypes.number
	}

	static defaultProps = {
		component: 'div',
		duration: 300,
		index: 0
	}

	UNSAFE_componentWillReceiveProps (nextProps) {
		this.previousIndex = this.props.index;
		this.checkReverse(nextProps);
	}

	/**
	 * Determines if we should be reversing the transition based on the index of the keys of the
	 * children.
	 *
	 * @param  {Object} nextProps New props
	 * @returns {undefined}
	 * @private
	 */
	checkReverse (nextProps) {
		// null or undefined => determine automatically
		if (nextProps.reverseTransition != null) {
			this.reverseTransition = !!nextProps.reverseTransition;
		} else if (this.props.index !== nextProps.index) {
			this.reverseTransition = this.props.index > nextProps.index;
		} else {
			this.reverseTransition = false;
		}
	}

	render () {
		const {arranger, childProps, children, duration, end, index, noAnimation, start, enteringDelay, enteringProp, ...rest} = this.props;
		const {previousIndex, reverseTransition} = this;
		const childrenList = React.Children.toArray(children);

		const from = (start || start === 0) ? start : index;
		const to = (end || end === 0) && end >= index ? end : index;
		const size = to - from + ((noAnimation || !arranger) ? 0 : 1);

		const views = childrenList.slice(from, to + 1);
		const childFactory = wrapWithView({
			arranger,
			duration,
			index,
			noAnimation,
			previousIndex,
			reverseTransition,
			enteringDelay,
			enteringProp,
			childProps
		});

		delete rest.reverseTransition;

		return (
			<TransitionGroup {...rest} childFactory={childFactory} size={size + 1} currentIndex={index}>
				{views}
			</TransitionGroup>
		);
	}
}

export default ViewManager;
export {ViewManager};
export * from './Arranger';
