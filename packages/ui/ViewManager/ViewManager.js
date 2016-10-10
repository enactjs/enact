/**
 * Exports the {@link module:@enact/ui/ViewManager~ViewManager} component and the
 * [arrangers]{@link module:@enact/ui/ViewManager~Arranger} for use with it.
 *
 * @module @enact/ui/ViewManager
 */

import {childrenEquals} from '@enact/core/util';
import React from 'react';

import {shape} from './Arranger';
import TransitionGroup from './TransitionGroup';
import {wrapWithView} from './View';

/**
 * A `ViewManager` controls the visibility of a configurable number of views, allowing for them to be
 * transitioned on and off the viewport.
 *
 * @class ViewManager
 * @public
 */
class ViewManager extends React.Component {

	static propTypes = {
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
		 * @type {React.PropTypes.node}
		 */
		children: React.PropTypes.node,

		/**
		 * Type of component wrapping the children. May be a DOM node or a custom React component.
		 *
		 * @type {String|React.Component}
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

	shouldComponentUpdate (nextProps) {
		// update when the index changes or the children change
		if (this.props.index !== nextProps.index) {
			return true;
		} else {
			return !childrenEquals(this.props.children, nextProps.children);
		}
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
