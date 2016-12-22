/*
 * Exports the {@link ui/ViewManager.View} component.
 */

import React from 'react';
import ReactDOM from 'react-dom';

import {shape} from './Arranger';

// Isomorphic guards
const nop = function () {};
const isBrowser = typeof window === 'object';
const cancelAnimationFrame = isBrowser ? window.cancelAnimationFrame.bind(window) : nop;
const requestAnimationFrame = isBrowser ? window.requestAnimationFrame.bind(window) : nop;
const now = isBrowser ? window.performance.now.bind(window.performance) : nop;

/**
 * A `View` wraps a set of children for {@link ui/ViewManager.ViewManager}.
 * It is not intended to be used directly
 *
 * @class View
 * @memberof ui/ViewManager
 * @private
 */
class View extends React.Component {

	static propTypes = /** @lends ui/ViewManager.View.prototype */ {
		children: React.PropTypes.node.isRequired,

		/**
		 * Time in milliseconds to complete a transition
		 *
		 * @type {Number}
		 */
		duration: React.PropTypes.number.isRequired,

		/**
		 * Arranger to control the animation
		 *
		 * @type {Arranger}
		 */
		arranger: shape,

		/**
		 * Index of the currently 'active' view.
		 *
		 * @type {Number}
		 */
		index: React.PropTypes.number,

		/**
		 * Indicates if the transition should be animated
		 *
		 * @type {Boolean}
		 * @default true
		 */
		noAnimation: React.PropTypes.bool,

		/**
		 * Index of the previously 'active' view.
		 *
		 * @type {Number}
		 */
		previousIndex: React.PropTypes.number,

		/**
		 * Indicates if the transition should be reversed. The effect depends on how the provided
		 * `arranger` handles reversal.
		 *
		 * @type {Boolean}
		 * @default false
		 */
		reverseTransition: React.PropTypes.bool
	}

	constructor (props) {
		super(props);
		this.animation = null;
	}

	componentWillReceiveProps (nextProps) {
		// changeDirection let's us know we need to switch mid-transition
		this.changeDirection = this.animation ? this.props.reverseTransition !== nextProps.reverseTransition : false;
	}

	componentWillUnmount () {
		this.cancelAnimationFrame();
	}

	cancelAnimationFrame () {
		if (this._raf) {
			cancelAnimationFrame(this._raf);
			this._raf = null;
		}
	}

	componentWillAppear (callback) {
		const {arranger} = this.props;
		if (arranger && arranger.stay) {
			this.prepareTransition(arranger.stay, callback, true);
		} else {
			callback();
		}
	}

	// This is called at the same time as componentDidMount() for components added to an existing
	// TransitionGroup. It will block other animations from occurring until callback is called. It
	// will not be called on the initial render of a TransitionGroup.
	componentWillEnter (callback) {
		const {arranger, reverseTransition} = this.props;
		if (arranger) {
			this.prepareTransition(reverseTransition ? arranger.leave : arranger.enter, callback);
		} else {
			callback();
		}
	}

	componentWillStay (callback) {
		const {arranger} = this.props;
		if (arranger && arranger.stay) {
			this.prepareTransition(arranger.stay, callback);
		} else {
			callback();
		}
	}

	// This is called when the child has been removed from the ReactTransitionGroup. Though the
	// child has been removed, ReactTransitionGroup will keep it in the DOM until callback is
	// called.
	componentWillLeave (callback) {
		const {arranger, reverseTransition} = this.props;
		if (arranger) {
			this.prepareTransition(reverseTransition ? arranger.enter : arranger.leave, callback);
		} else {
			callback();
		}
	}

	/**
	 * Initiates a new transition
	 *
	 * @param	{Function}	arranger		Arranger function to call (enter, leave)
	 * @param	{Function}	callback		Completion callback
	 * @param	{Boolean}	[noAnimation]	`true` to disable animation for this transition
	 * @returns {undefined}
	 * @private
	 */
	prepareTransition = (arranger, callback, noAnimation) => {
		const {duration, index, previousIndex, reverseTransition} = this.props;
		const startTime = now();
		const endTime = startTime + duration;
		/* eslint react/no-find-dom-node: "off" */
		const node = ReactDOM.findDOMNode(this);

		// disable animation when the instance or props flag is true
		noAnimation = noAnimation || this.props.noAnimation;

		// Arranges the control each tick and calls the provided callback on complete
		const fn = (start, end, time) => {
			this.cancelAnimationFrame();

			// percent is the ratio (between 0 and 1) of the current step to the total steps
			const percent = (time - start) / (end - start);
			if (!noAnimation && percent < 1) {
				// the transition is still in progress so call the arranger
				arranger({
					node,
					percent,
					reverseTransition,
					from: previousIndex,
					to: index
				});

				return true;
			} else {
				// the transition is complete so clean up and ensure we fire a final arrange with
				// a value of 1.
				this.animation = null;
				arranger({
					node,
					percent: 1,
					reverseTransition,
					from: previousIndex,
					to: index
				});
				callback();

				return false;
			}
		};

		let initialTime = 0;

		// When a new transition is initiated mid-transition, adjust time to account for the current
		// percent complete.
		if (this.animation && this.changeDirection) {
			const a = this.animation;
			const percentComplete = (a.time - a.start) / (a.end - a.start);
			initialTime = (endTime - startTime) * (1 - percentComplete);
		}

		this.transition(startTime, endTime, initialTime, fn);
	}

	/**
	 * Calls the arranger method and schedules the next animation frame
	 *
	 * @param   {Number}    start    Animation start time
	 * @param   {Number}    end      Animation end time
	 * @param   {Number}    time     Current animation time
	 * @param   {Function}  callback Completion callback
	 * @returns {undefined}
	 * @private
	 */
	transition = (start, end, time, callback) => {
		const a = this.animation = this.animation || {};
		a.start = start;
		a.end = end;
		a.time = time;

		if (callback(start, end, time)) {
			this._raf = requestAnimationFrame(() => {
				const current = now();
				this.transition(start, end, current, callback);
			});
		} else {
			this._raf = null;
		}
	}

	render () {
		return React.Children.only(this.props.children);
	}
}

// Not a true render method but instead a wrapper for TransitionGroup to wrap arbitrary children
// with a TransitionGroup-compatible child that supports animation
//
// eslint-disable-next-line enact/display-name
const wrapWithView = (config) => (child) => {
	return <View {...config}>{child}</View>;
};

export default View;
export {View, wrapWithView};
