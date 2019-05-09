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
import PropTypes from 'prop-types';
import React from 'react';

import ForwardRef from '../ForwardRef';

import {shape} from './Arranger';
import TransitionGroup from './TransitionGroup';
import {wrapWithView} from './View';

/**
 * The base `ViewManager` component, without
 * [ViewManagerDecorator](ui/ViewManager.ViewManagerDecorator) applied.
 *
 * @class ViewManagerBase
 * @memberof ui/ViewManager
 * @ui
 * @public
 */
const ViewManagerBase = class extends React.Component {
	static displayName = 'ViewManager'

	static propTypes = /** @lends ui/ViewManager.ViewManagerBase.prototype */ {
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
		 * Called with a reference to [component]{@link ui/ViewManager.ViewManager#component}
		 *
		 * @type {Function}
		 * @private
		 */
		componentRef: PropTypes.func,

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

	constructor (props) {
		super(props);
		this.state = {
			prevIndex: null,
			reverseTransition: null
		};
	}

	static getDerivedStateFromProps (props, state) {
		if (props.reverseTransition != null) {
			return {
				reverseTransition: !!props.reverseTransition
			};
		} else if (props.index !== state.index) {
			return {
				index: props.index,
				prevIndex: state.index,
				reverseTransition: state.index > props.index
			};
		}

		return null;
	}

	render () {
		const {arranger, childProps, children, duration, index, noAnimation, enteringDelay, enteringProp, ...rest} = this.props;
		let {end = index, start = index} = this.props;
		const {prevIndex: previousIndex, reverseTransition} = this.state;
		const childrenList = React.Children.toArray(children);

		if (index > end) end = index;
		if (index < start) start = index;

		const childCount = end - start + 1;
		const size = (noAnimation || !arranger) ? childCount : childCount + 1;

		const views = childrenList.slice(start, start + childCount);
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

		delete rest.end;
		delete rest.reverseTransition;
		delete rest.start;

		return (
			<TransitionGroup {...rest} childFactory={childFactory} size={size} currentIndex={index}>
				{views}
			</TransitionGroup>
		);
	}
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
