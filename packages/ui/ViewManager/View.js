/**
 * Exports the {@link module:enact-ui/ViewManager~View} component.
 *
 * @module enact-ui/ViewManager/View
 */

import React from 'react';
import ReactDOM from 'react-dom';

import {shape} from './Arranger';
import shallowEqual from 'recompose/shallowEqual';

const TICK = 17;

/**
 * A `View` wraps a set of children for {@link module:enact-ui/ViewManager~ViewManager}.
 * It is not intended to be used directly
 *
 * @class View
 * @private
 */
class View extends React.Component {

	static propTypes = {
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
		this.state = {
			step: null
		};
	}

	shouldComponentUpdate (nextProps, nextState) {
		// we're storing the current step in state but don't want to trigger a render on change
		// because that's handled in the rAF.
		if (nextState.step !== this.state.step) {
			return false;
		}

		// since state is checked above, we can just check props for equality
		return !shallowEqual(this.props, nextProps);
	}

	componentWillReceiveProps (nextProps) {
		// changeDirection let's us know we need to switch mid-transition
		this.changeDirection = this.state.step ? this.props.reverseTransition !== nextProps.reverseTransition : false;
	}

	componentWillUnmount () {
		window.cancelAnimationFrame(this._raf);
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
	 * @param  {Function} arranger Arranger function to call (enter, leave)
	 * @param  {Function} callback Completion callback
	 * @returns {undefined}
	 */
	prepareTransition = (arranger, callback) => {
		const {noAnimation, duration, index, previousIndex, reverseTransition} = this.props;
		const steps = Math.ceil(duration / TICK);
		/* eslint react/no-find-dom-node: "off" */
		const node = ReactDOM.findDOMNode(this);

		// Arranges the control each tick and calls the provided callback on complete
		const fn = (step) => {
			window.cancelAnimationFrame(this._raf);

			// percent is the ratio (between 0 and 1) of the current step to the total steps
			const percent = step / steps;
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
				this.setState({step: null});
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

		// When a new transition is initiated mid-transition, this.state.step will hold the previous
		// progress. This assumes that the duration hasn't changed.
		let initialStep = (this.state.step && this.changeDirection) ? steps - this.state.step : 0;
		this.transition(initialStep, fn);
	}

	/**
	 * Calls the arranger method and schedules the next animation frame
	 *
	 * @param  {Number}   step     Current step > 0 and <= total steps for transition
	 * @param  {Function} callback Completion callback
	 * @returns {undefined}
	 */
	transition = (step, callback) => {
		this.setState({step});
		if (callback(step)) {
			this._raf = window.requestAnimationFrame(() => this.transition(step + 1, callback));
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
// eslint-disable-next-line react/display-name
const wrapWithView = (config) => (child) => {
	return <View {...config}>{child}</View>;
};

export default View;
export {View, wrapWithView};
