/**
 * Exports the {@link ui/ViewManager.ViewManager} component and the
 * arrangers for use with it.
 *
 * @module ui/ViewManager
 */

import React from 'react';

import {shape} from './Arranger';
import TransitionGroup from './TransitionGroup';
import {wrapWithView} from './View';

/**
 * A `ViewManager` controls the visibility of a configurable number of views, allowing for them to be
 * transitioned on and off the viewport.
 *
 * @class ViewManager
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
		 * Views to be managed. May be any renderable component including custom React components or
		 * primitive DOM nodes.
		 *
		 * @type {Node}
		 */
		children: React.PropTypes.node,

		/**
		 * Type of component wrapping the children. May be a DOM node or a custom React component.
		 *
		 * @type {String|Component}
		 * @default 'div'
		 */
		component: React.PropTypes.oneOfType([
			React.PropTypes.func,
			React.PropTypes.string
		]),

		/**
		 * Time in milliseconds to complete a transition
		 *
		 * @type {Number}
		 * @default 300
		 */
		duration: React.PropTypes.number,

		/**
		 * Index of last visible view. Defaults to the current value of `index`.
		 *
		 * @type {Number}
		 * @default value of index
		 */
		end: React.PropTypes.number,

		/**
		 * Index of active view
		 *
		 * @type {Number}
		 * @default 0
		 */
		index: React.PropTypes.number,

		/**
		 * Indicates if the transition should be animated
		 *
		 * @type {Boolean}
		 * @default false
		 */
		noAnimation: React.PropTypes.bool,

		/**
		 * Called when each view is rendered during initial construction.
		 *
		 * @type {Function}
		 */
		onAppear: React.PropTypes.func,

		/**
		 * Called when each view completes its transition into the viewport.
		 *
		 * @type {Function}
		 */
		onEnter: React.PropTypes.func,

		/**
		 * Called when each view completes its transition out of the viewport.
		 *
		 * @type {Function}
		 */
		onLeave: React.PropTypes.func,

		/**
		 * Called when each view completes its transition within the viewport.
		 *
		 * @type {Function}
		 */
		onStay: React.PropTypes.func,

		/**
		 * Called once when all views have completed their transition.
		 *
		 * @type {Function}
		 */
		onTransition: React.PropTypes.func,

		/**
		 * Called once before views begin their transition.
		 *
		 * @type {Function}
		 */
		onWillTransition: React.PropTypes.func,

		/**
		 * Explicitly sets the transition direction. If omitted, the direction is determined
		 * automaticallly based on the change of index or a string comparison of the first child's
		 * key
		 *
		 * @type {Boolean}
		 */
		reverseTransition: React.PropTypes.bool,

		/**
		 * Index of first visible view. Defaults to the current value of `index`.
		 *
		 * @type {Number}
		 * @default value of index
		 */
		start: React.PropTypes.number
	}

	static defaultProps = {
		component: 'div',
		duration: 300,
		index: 0
	}

	componentWillReceiveProps (nextProps) {
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
		const {children, arranger, noAnimation, duration, index, start, end, ...rest} = this.props;
		const {previousIndex, reverseTransition} = this;
		const childrenList = React.Children.toArray(children);

		const from = (start || start === 0) ? start : index;
		const to = (end || end === 0) && end >= index ? end : index;
		const size = to - from + 1;

		const views = childrenList.slice(from, to + 1);
		const childFactory = wrapWithView({duration, arranger, noAnimation, index, previousIndex, reverseTransition});

		delete rest.reverseTransition;

		return (
			<TransitionGroup {...rest} childFactory={childFactory} size={size + 1}>
				{views}
			</TransitionGroup>
		);
	}
}

export default ViewManager;
export {ViewManager};
export * from './Arranger';
