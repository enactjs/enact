/*
 * Exports the {@link ui/ViewManager.View} component.
 */

import {Job} from '@enact/core/util';
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import {shape} from './Arranger';

// If the View was "appearing", then entering will always be false and this will not result in a
// re-render. If the view should enter, state.enter will be true and this will toggle it to false
// causing a re-render.
const clearEntering = ({entering}) => {
	return entering ? {entering: false} : null;
};

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
		children: PropTypes.node.isRequired,

		/**
		 * Time in milliseconds to complete a transition
		 *
		 * @type {Number}
		 * @required
		 * @public
		 */
		duration: PropTypes.number.isRequired,

		/**
		 * Set to `true` when the View should 'appear' without transitioning into the viewport
		 *
		 * @type {Boolean}
		 * @public
		 */
		appearing: PropTypes.bool,

		/**
		 * Arranger to control the animation
		 *
		 * @type {Arranger}
		 * @public
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
		 * Time, in milliseconds, to wait after a view has entered to inform it by passing the
		 * `enteringProp` as `false`.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		enteringDelay: PropTypes.number,

		/**
		 * Name of the property to pass to the wrapped view to indicate when it is entering the
		 * viewport. When `true`, the view has been created but has not transitioned into place.
		 * When `false`, the view has finished its transition.
		 *
		 * The notification can be delayed by setting `enteringDelay`. If not set, the view will not
		 * be notified of the change in transition.
		 *
		 * @type {String}
		 * @public
		 */
		enteringProp: PropTypes.string,

		/**
		 * Index of the currently 'active' view.
		 *
		 * @type {Number}
		 */
		index: PropTypes.number,

		/**
		 * When `true`, indicates if a view is currently leaving.
		 *
		 * @type {Boolean}
		 */
		leaving: PropTypes.bool,

		/**
		 * When `true`, indicates if the transition should be animated
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		noAnimation: PropTypes.bool,

		/**
		 * Index of the previously 'active' view.
		 *
		 * @type {Number}
		 */
		previousIndex: PropTypes.number,

		/**
		 * When `true`, indicates if the transition should be reversed. The effect depends on how the provided
		 * `arranger` handles reversal.
		 *
		 * @type {Boolean}
		 * @default false
		 */
		reverseTransition: PropTypes.bool
	}

	static defaultProps = {
		appearing: false,
		enteringDelay: 0,
		index: 0,
		reverseTransition: false
	}

	constructor (props) {
		super(props);
		this.animation = null;
		this.state = {
			entering: !props.appearing
		};
	}

	shouldComponentUpdate (nextProps) {
		if (nextProps.leaving) {
			return false;
		}

		return true;
	}

	componentDidUpdate (prevProps) {
		this.changeDirection = this.animation ? this.props.reverseTransition !== prevProps.reverseTransition : false;
	}

	componentWillUnmount () {
		this.enteringJob.stop();
		this.node = null;
		if (this.animation) {
			this.animation.cancel();
		}
	}

	enteringJob = new Job(() => {
		this.setState(clearEntering);
	})

	componentWillAppear (callback) {
		const {arranger} = this.props;
		if (arranger && arranger.stay) {
			this.prepareTransition(arranger.stay, callback, true);
		} else {
			callback();
		}
	}

	componentDidAppear () {
		this.setState(clearEntering);
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

	componentDidEnter () {
		const {enteringDelay, enteringProp} = this.props;

		if (enteringProp) {
			// FIXME: `startRafAfter` is a temporary solution using rAF. We need a better way to handle
			// transition cycle and component life cycle to be in sync. See ENYO-4835.
			this.enteringJob.startRafAfter(enteringDelay);
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
		this.enteringJob.stop();
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
		const {duration, index, previousIndex = index, reverseTransition} = this.props;

		// Need to ensure that we have a valid node reference before we animation. Sometimes, React
		// will replace the node after mount causing a reference cached there to be invalid.
		// eslint-disable-next-line react/no-find-dom-node
		this.node = ReactDOM.findDOMNode(this);

		if (this.animation && this.animation.playState !== 'finished' && this.changeDirection) {
			this.animation.reverse();
		} else {
			this.animation = arranger({
				from: previousIndex,
				node: this.node,
				reverse: reverseTransition,
				to: index,
				fill: 'forwards',
				duration
			});
		}

		// Must set a new handler here to ensure the right callback is invoked
		this.animation.onfinish = () => {
			this.animation = null;
			// Possible for the animation callback to still be fired after the node has been
			// umounted if it finished before the unmount can cancel it so we check for that.
			if (this.node) {
				callback();
			}
		};

		// disable animation when the instance or props flag is true
		if (noAnimation || this.props.noAnimation) {
			this.animation.finish();
		}
	}

	render () {
		const {enteringProp, children, childProps} = this.props;

		if (enteringProp || childProps) {
			const props = Object.assign({}, childProps);
			if (enteringProp) {
				props[enteringProp] = this.state.entering;
			}

			return React.cloneElement(children, props);
		} else {
			return React.Children.only(children);
		}
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
