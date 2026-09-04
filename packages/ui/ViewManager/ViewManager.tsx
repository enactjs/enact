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

import {EnactPropTypes} from '@enact/core/internal/prop-types';
import handle, {forwardCustom} from '@enact/core/handle';
import {Children, Component, ReactElement} from 'react';

import ForwardRef from '../ForwardRef';

import {type shapeType} from './Arranger';
import TransitionGroup from './TransitionGroup';
import {wrapWithView} from './View';
import {Callback, CallbackObject} from '../types';

export type ViewManagerState = {
	index: number | null,
	prevIndex?: number,
	reverseTransition?: boolean
};

export interface ViewManagerProps {
	/**
	 * Arranger to control the animation
	 *
	 * @type {Arranger}
	 */
	arranger: shapeType,

	/**
	 * An object containing properties to be passed to each child.
	 *
	 * @type {Object}
	 * @public
	 */
	childProps: CallbackObject,

	/**
	 * Views to be managed.
	 *
	 * May be any renderable component including custom React components or primitive DOM nodes.
	 *
	 * @type {Node}
	 */
	children: ReactElement,

	/**
	 * Type of component wrapping the children. May be a DOM node or a custom React component.
	 *
	 * @type {String|Component}
	 * @default 'div'
	 */
	component?: EnactPropTypes.renderable,

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
	duration?: number,

	/**
	 * Index of last visible view.
	 *
	 * Defaults to the current value of `index`.
	 *
	 * @type {Number}
	 * @default value of index
	 */
	end?: number,

	/**
	 * Time, in milliseconds, to wait after a view has entered to inform it by pass the
	 * `enteringProp` as false.
	 *
	 * @type {Number}
	 * @default 0
	 */
	enteringDelay: number,

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
	enteringProp: string,

	/**
	 * Index of active view
	 *
	 * @type {Number}
	 * @default 0
	 */
	index?: number,

	/**
	 * Indicates if the transition should be animated
	 *
	 * @type {Boolean}
	 * @default false
	 */
	noAnimation: boolean,

	/**
	 * Called when each view is rendered during initial construction.
	 *
	 * @type {Function}
	 */
	onAppear: Callback,

	/**
	 * Called when each view completes its transition into the viewport.
	 *
	 * @type {Function}
	 */
	onEnter: Callback,

	/**
	 * Called when each view completes its transition out of the viewport.
	 *
	 * @type {Function}
	 */
	onLeave: Callback,

	/**
	 * Called when each view completes its transition within the viewport.
	 *
	 * @type {Function}
	 */
	onStay: Callback,

	/**
	 * Called once when all views have completed their transition.
	 *
	 * @type {Function}
	 */
	onTransition: Callback,

	/**
	 * Called once before views begin their transition.
	 *
	 * @type {Function}
	 */
	onWillTransition: Callback,

	/**
	 * Explicitly sets the transition direction.
	 *
	 * If omitted, the direction is determined automatically based on the change of index or a
	 * string comparison of the first child's key.
	 *
	 * @type {Boolean}
	 */
	reverseTransition?: boolean,

	/**
	 * Indicates the current locale uses right-to-left reading order.
	 *
	 * `rtl` is passed to the `arranger` in order to alter the animation (e.g. reversing the
	 * horizontal direction).
	 *
	 * @type {Boolean}
	 */
	rtl: boolean,

	/**
	 * Index of first visible view. Defaults to the current value of `index`.
	 *
	 * @type {Number}
	 * @default value of index
	 */
	start?: number
}

/**
 * The base `ViewManager` component, without
 * {@link ui/ViewManager.ViewManagerDecorator|ViewManagerDecorator} applied.
 *
 * @class ViewManagerBase
 * @memberof ui/ViewManager
 * @ui
 * @public
 */
const ViewManagerBase = class extends Component<ViewManagerProps, ViewManagerState> {
	static displayName = 'ViewManager';

	static defaultProps = {
		component: 'div',
		duration: 300,
		index: 0
	};

	constructor (props: ViewManagerProps) {
		super(props);

		this.state = {
			index: null
		};
	}

	static getDerivedStateFromProps (props: ViewManagerProps, state: ViewManagerState) {
		if (props.reverseTransition) {
			return {
				index: props.index,
				prevIndex: state.index,
				reverseTransition: props.reverseTransition
			};
		} else if (props.index !== state.index) {
			return {
				index: props.index,
				prevIndex: state.index,
				reverseTransition: (state.index ?? 0) > (props.index || 0)
			};
		}

		return null;
	}

	// Merges optional props with defaultProps so TypeScript knows they are never undefined inside the class.
	private get safeProps () {
		return this.props as Readonly<ViewManagerProps> & typeof ViewManagerBase.defaultProps;
	}

	makeTransitionEvent = () => {
		return {index: this.props.index, previousIndex: this.state.prevIndex};
	};

	handleTransition = handle(
		forwardCustom('onTransition', this.makeTransitionEvent)
	).bindAs(this, 'handleTransition');

	handleWillTransition = handle(
		forwardCustom('onWillTransition', this.makeTransitionEvent)
	).bindAs(this, 'handleWillTransition');

	render () {
		const {arranger, childProps, children, duration, index, noAnimation, enteringDelay, enteringProp, rtl, ...rest} = this.safeProps;
		let {end = index, start = index} = this.props;
		const {prevIndex: previousIndex, reverseTransition} = this.state;
		const childrenList = Children.toArray(children);

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
			childProps,
			rtl: Boolean(rtl)
		});

		delete rest.end;
		delete rest.reverseTransition;
		delete rest.start;

		return (
			<TransitionGroup
				{...rest}
				childFactory={childFactory}
				currentIndex={index}
				onTransition={this.handleTransition}
				onWillTransition={this.handleWillTransition}
				size={size}
			>
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
