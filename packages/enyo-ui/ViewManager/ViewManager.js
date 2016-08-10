import R from 'ramda';
import React from 'react';
import TransitionGroup from './TransitionGroup';

import {wrapWithView} from './View';
import {shape} from './Arranger';

const keys = R.compose(R.sort((a, b) => a - b), R.map(R.prop('key')));
const equals = R.useWith(R.equals, [keys, keys]);
const childrenEquals = (prev, next) => {
	const prevChildren = React.Children.toArray(prev);
	const nextChildren = React.Children.toArray(next);

	if (prevChildren.length !== nextChildren.length) {
		return false;
	} else {
		return equals(prevChildren, nextChildren);
	}
};

class ViewManager extends React.Component {

	static propTypes = {
		/**
		 * Indicates if the transition should be animated
		 *
		 * @type {Boolean}
		 * @default true
		 */
		animate: React.PropTypes.bool,

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
		if (this.props.index !== nextProps.index) {
			this.reverse = this.props.index > nextProps.index;
		} else {
			const prevChildren = React.Children.toArray(this.props.children);
			const nextChildren = React.Children.toArray(nextProps.children);

			// short-circuit for the common case of swapping out 1 child
			if (prevChildren.length === 1 && nextChildren.length === 1) {
				this.reverse = prevChildren[0].key > nextChildren[0].key;
			} else {
				// not yet implemented
			}
		}
	}

	render () {
		const {children, arranger, animate, duration, index, start, end, ...rest} = this.props;
		const {previousIndex, reverse} = this;
		const childrenList = React.Children.toArray(children);

		const from = (start || start === 0) ? start : index;
		const to = (end || end === 0) && end >= index ? end : index;
		const size = to - from + 1;

		const views = childrenList.slice(from, to + 1);
		const childFactory = wrapWithView({duration, arranger, animate, index, previousIndex, reverse});

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
