/*
 * Exports the {@link ui/ViewManager.View} component.
 */

import {checkPropTypes, Job, setDefaultProps, usePrevious} from '@enact/core/util';
import {cloneElement, Children, useState, useRef, useEffect, useCallback, useLayoutEffect, useImperativeHandle, memo, useMemo} from 'react';
import PropTypes from 'prop-types';

import {shape} from './Arranger';

// If the View was "appearing", then entering will always be false and this will not result in a
// re-render. If the view should enter, state.enter will be true and this will toggle it to false
// causing a re-render.
const clearEntering = ({entering}) => {
	return entering ? {entering: false} : null;
};

const viewDefaultProps = {
	appearing: false,
	enteringDelay: 0,
	index: 0,
	reverseTransition: false
};

/**
 * A `View` wraps a set of children for {@link ui/ViewManager.ViewManager}.
 * It is not intended to be used directly
 *
 * @class View
 * @memberof ui/ViewManager
 * @private
 */
const View = memo((componentProps) => {
	const props = useMemo(() => setDefaultProps(componentProps, viewDefaultProps), [componentProps]);

	const [state, setState] = useState({entering: !props.appearing});

	const enteringJob = useMemo(() => new Job(() => {
		setState(clearEntering);
	}), []);

	const animation = useRef(null);
	const changeDirection = useRef(false);
	const node = useRef(null);

	const previousProps = usePrevious(props);

	const shouldChangeDirection = useCallback((prevProps, nextProps) => {
		return animation.current ? prevProps.reverseTransition !== nextProps.reverseTransition : false;
	}, []);

	/**
	 * Initiates a new transition
	 *
	 * @param	{Function}	arranger		Arranger function to call (enter, leave)
	 * @param	{Function}	callback		Completion callback
	 * @param	{Boolean}	[noAnimation]	`true` to disable animation for this transition
	 * @returns {undefined}
	 * @private
	 */
	const prepareTransition = useCallback((arranger, callback, noAnimation) => {
		const {duration, getParentRef, index, previousIndex = index, renderedIndex = 0, reverseTransition, rtl} = props;

		// Need to ensure that we have a valid node reference before we animation. Sometimes, React
		// will replace the node after mount causing a reference cached there to be invalid.
		node.current = getParentRef?.()?.children?.[renderedIndex];

		if (animation.current && animation.current.playState !== 'finished' && changeDirection.current) {
			animation.current.reverse();
		} else {
			animation.current = arranger({
				from: previousIndex,
				node: node.current,
				reverse: reverseTransition,
				rtl,
				to: index,
				fill: 'forwards',
				duration
			});
		}

		// Must set a new handler here to ensure the right callback is invoked
		animation.current.onfinish = () => {
			animation.current = null;
			// Possible for the animation callback to still be fired after the node has been
			// unmounted if it finished before the unmount can cancel it so we check for that.
			if (node.current) {
				callback();
			}
		};

		// disable animation when the instance or props flag is true
		if (noAnimation || props.noAnimation) {
			animation.current.finish();
		}
	}, [props]);

	useImperativeHandle(props.ref, () => ({
		componentWillAppear (callback) {
			const {arranger} = props;
			if (arranger && arranger.stay) {
				prepareTransition(arranger.stay, callback, true);
			} else {
				callback();
			}
		},

		componentDidAppear () {
			setState(clearEntering);
		},

		// This is called at the same time as componentDidMount() for components added to an existing
		// TransitionGroup. It will block other animations from occurring until callback is called. It
		// will not be called on the initial render of a TransitionGroup.
		componentWillEnter (callback) {
			const {appearing, arranger, reverseTransition, enteringProp} = props;
			// This can happen if the panel was going to be removed and the animation was canceled,
			// causing this panel to re-enter.
			if (!appearing && enteringProp && !state.entering) {
				setState({entering: true});
			}
			if (arranger) {
				prepareTransition(reverseTransition ? arranger.leave : arranger.enter, callback);
			} else {
				callback();
			}
		},

		componentDidEnter () {
			const {enteringDelay, enteringProp} = props;

			if (enteringProp) {
				// FIXME: `startRafAfter` is a temporary solution using rAF. We need a better way to handle
				// transition cycle and component life cycle to be in sync. See ENYO-4835.
				enteringJob.startRafAfter(enteringDelay);
			} else {
				enteringJob.start();
			}
		},

		componentWillStay (callback) {
			const {arranger} = props;
			if (arranger && arranger.stay) {
				prepareTransition(arranger.stay, callback);
			} else {
				callback();
			}
		},

		// This is called when the child has been removed from the ReactTransitionGroup. Though the
		// child has been removed, ReactTransitionGroup will keep it in the DOM until callback is
		// called.
		componentWillLeave (callback) {
			const {arranger, reverseTransition} = props;
			enteringJob.stop();
			if (arranger) {
				prepareTransition(reverseTransition ? arranger.enter : arranger.leave, callback);
			} else {
				callback();
			}
		}
	}));

	useLayoutEffect(() => {
		return () => {
			enteringJob.stop();
			node.current = null;
			if (animation.current && typeof animation.current.cancel === 'function') {
				animation.current.cancel();
			}
		};
	}, [enteringJob]);

	useEffect(() => {
		if (props.leaving) {
			changeDirection.current = shouldChangeDirection(previousProps, props);
		}
	}, [props.leaving, previousProps, props, shouldChangeDirection]);

	useEffect(() => {
		checkPropTypes(View, props);
		changeDirection.current = shouldChangeDirection(previousProps, props);
	}, [previousProps, props, shouldChangeDirection]);

	useEffect(() => {
		if (props.enteringProp) {
			// FIXME: `startRafAfter` is a temporary solution using rAF. We need a better way to handle
			// transition cycle and component life cycle to be in sync. See ENYO-4835.
			enteringJob.startRafAfter(props.enteringDelay);
		} else {
			enteringJob.start();
		}
	}, [enteringJob, props.enteringDelay, props.enteringProp]);

	if (props.enteringProp || props.childProps) {
		const localProps = Object.assign({}, props.childProps);
		if (props.enteringProp) {
			localProps[props.enteringProp] = state.entering;
		}

		return cloneElement(props.children, localProps);
	} else {
		return Children.only(props.children);
	}
}, (_, nextProps) => !nextProps.leaving);

View.propTypes = /** @lends ui/ViewManager.View.prototype */ {
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
	 * A getter function for a DOM node of the parent element
	 *
	 * @type {Function}
	 * @private
	 */
	getParentRef: PropTypes.func,

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
	 * Index of the view node among the rendered children of the parent node
	 *
	 * @type {Number}
	 * @private
	 */
	renderedIndex: PropTypes.number,

	/**
	 * When `true`, indicates if the transition should be reversed. The effect depends on how the provided
	 * `arranger` handles reversal.
	 *
	 * @type {Boolean}
	 * @default false
	 */
	reverseTransition: PropTypes.bool,

	/**
	 * When `true`, indicates the current locale uses right-to-left reading order.
	 *
	 * The effect depends on how the provided `arranger` handles this option.
	 *
	 * @type {Boolean}
	 */
	rtl: PropTypes.bool
};

// Not a true render method but instead a wrapper for TransitionGroup to wrap arbitrary children
// with a TransitionGroup-compatible child that supports animation
//
// eslint-disable-next-line enact/display-name
const wrapWithView = (config) => (child) => {
	return <View {...config}>{child}</View>;
};

export default View;
export {View, wrapWithView};
