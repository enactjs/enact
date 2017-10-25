/**
 * Exports the {@link ui/Transition.Transition} and {@link ui/Transition.TransitionBase}
 * components.  The default export is {@link ui/Transition.Transition}.
 *
 * @module ui/Transition
 */

import {forward} from '@enact/core/handle';
import kind from '@enact/core/kind';
import {Job} from '@enact/core/util';
import {contextTypes} from '@enact/core/internal/PubSub';
import React from 'react';
import PropTypes from 'prop-types';

import css from './Transition.less';

const forwardTransitionEnd = forward('onTransitionEnd');

/**
 * {@link ui/Transition.TransitionBase} is a stateless component that allows for applying
 * transitions to its child items via configurable properties and events. In general, you want to
 * use the stateful version, {@link ui/Transition.Transition}.
 *
 * @class TransitionBase
 * @memberof ui/Transition
 * @public
 */
const TransitionBase = kind({
	name: 'TransitionBase',

	propTypes: /** @lends ui/Transition.TransitionBase.prototype */ {
		children: PropTypes.node.isRequired,

		/**
		 * Provide a function to get the reference to the child node (the one with the content) at
		 * render time. Useful if you need to measure or interact with the node directly.
		 *
		 * @type {Function}
		 * @default null
		 * @public
		 */
		childRef: PropTypes.func,

		/**
		 * Specifies the height of the transition when `type` is set to `'clip'`.
		 *
		 * @type {Number}
		 * @default null
		 * @public
		 */
		clipHeight: PropTypes.number,

		/**
		 * Sets the direction of transition. Where the component will move *to*; the destination.
		 * Supported directions are: `'up'`, `'right'`, `'down'`, `'left'`.
		 *
		 * @type {String}
		 * @default 'up'
		 * @public
		 */
		direction: PropTypes.oneOf(['up', 'right', 'down', 'left']),

		/**
		 * Control how long the transition should take.
		 * Supported durations are: `'short'` (250ms), `'long'` (1s). `'medium'` (500ms) is default
		 * when no others are specified.
		 *
		 * @type {String}
		 * @default 'medium'
		 * @public
		 */
		duration: PropTypes.oneOf(['short', 'medium', 'long']),

		/**
		 * When `true`, transition animation is disabled. When `false`, visibility changes animate.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAnimation: PropTypes.bool,

		/**
		 * Customize the transition timing function.
		 * Supported functions are: linear, ease. ease-in-out is the default when none others are
		 * specified.
		 *
		 * @type {String}
		 * @default 'ease-in-out'
		 * @public
		 */
		timingFunction: PropTypes.oneOf(['ease-in-out', 'ease', 'linear']),

		/**
		 * Choose how you'd like the transition to affect the content.
		 * Supported types are: slide, clip, and fade.
		 *
		 * @type {String}
		 * @default 'slide'
		 * @public
		 */
		type: PropTypes.oneOf(['slide', 'clip', 'fade']),

		/**
		 * Set the visibility of the component, which determines whether it's on screen or off.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		visible: PropTypes.bool
	},

	defaultProps: {
		noAnimation: false,
		direction: 'up',
		duration: 'medium',
		timingFunction: 'ease-in-out',
		type: 'slide',
		visible: true
	},

	styles: {
		css,
		className: 'transition'
	},

	computed: {
		className: ({direction, duration, timingFunction, type, visible, styler}) => styler.append(
			visible ? 'shown' : 'hidden',
			direction && css[direction],
			duration && css[duration],
			timingFunction && css[timingFunction],
			css[type]
		),
		style: ({clipHeight, type, visible, style}) => type === 'clip' ? {
			...style,
			height: visible ? clipHeight : null,
			overflow: 'hidden'
		} : style,
		childRef: ({childRef, noAnimation, children}) => (noAnimation || !children) ? null : childRef
	},

	render: ({childRef, children, noAnimation, type, visible, ...rest}) => {
		delete rest.clipHeight;
		delete rest.direction;
		delete rest.duration;
		delete rest.timingFunction;

		if (noAnimation && !visible) {
			return null;
		}

		if (type === 'slide') {
			return (
				<div className={css.transitionFrame}>
					<div {...rest} ref={childRef}>
						{children}
					</div>
				</div>
			);
		} else {
			return (
				<div {...rest} ref={childRef}>
					<div className={css.inner}>
						{children}
					</div>
				</div>
			);
		}
	}
});

const TRANSITION_STATE = {
	INIT: 0,		// closed and unmeasured
	MEASURE: 1,		// open but need to measure
	READY: 2		// measured and ready
};

/**
 * {@link ui/Transition.Transition} is a stateful component that allows for applying transitions
 * to its child items via configurable properties and events.
 *
 * @class Transition
 * @memberof ui/Transition
 * @public
 */
class Transition extends React.Component {

	static contextTypes = contextTypes

	static propTypes = /** @lends ui/Transition.Transition.prototype */ {
		children: PropTypes.node.isRequired,

		/**
		 * The height of the transition when `type` is set to `'clip'`.
		 *
		 * @type {Number}
		 * @default null
		 * @public
		 */
		clipHeight: PropTypes.number,

		/**
		 * The direction of transition (i.e. where the component will move *to*; the destination).
		 * Supported directions are: `'up'`, `'right'`, `'down'`, `'left'`.
		 *
		 * @type {String}
		 * @default 'up'
		 * @public
		 */
		direction: PropTypes.oneOf(['up', 'right', 'down', 'left']),

		/**
		 * The duration of the transition.
		 * Supported durations are: `'short'` (250ms), `'long'` (1s) and `'medium'` (500ms).
		 *
		 * @type {String}
		 * @default 'medium'
		 * @public
		 */
		duration: PropTypes.oneOf(['short', 'medium', 'long']),

		/**
		 * A function to run after transition for hiding is finished.
		 *
		 * @type {Function}
		 * @public
		 */
		onHide: PropTypes.func,

		/**
		 * A function to run after transition for showing is finished.
		 *
		 * @type {Function}
		 * @public
		 */
		onShow: PropTypes.func,

		/**
		 * The transition timing function.
		 * Supported functions are: `'linear'`, `'ease'` and `'ease-in-out'`
		 *
		 * @type {String}
		 * @default 'ease-in-out'
		 * @public
		 */
		timingFunction: PropTypes.oneOf(['ease-in-out', 'ease', 'linear']),

		/**
		 * How the transition affects the content.
		 * Supported types are: `'slide'`, `'clip'`, and `'fade'`.
		 *
		 * @type {String}
		 * @default 'slide'
		 * @public
		 */
		type: PropTypes.oneOf(['slide', 'clip', 'fade']),

		/**
		 * The visibility of the component, which determines whether it's on screen or off.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		visible: PropTypes.bool
	}

	static defaultProps = {
		direction: 'up',
		duration: 'medium',
		timingFunction: 'ease-in-out',
		type: 'slide',
		visible: true
	}

	constructor (props) {
		super(props);

		this.state = {
			initialHeight: null,
			renderState: props.visible ? TRANSITION_STATE.READY : TRANSITION_STATE.INIT
		};
	}

	componentDidMount () {
		if (!this.props.visible) {
			this.measuringJob.idle();
		} else {
			this.measureInner();
		}

		if (this.context.Subscriber) {
			this.context.Subscriber.subscribe('resize', this.handleResize);
		}
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.visible && this.state.renderState === TRANSITION_STATE.INIT) {
			this.setState({
				renderState: TRANSITION_STATE.MEASURE
			});
		}
	}

	shouldComponentUpdate (nextProps, nextState) {
		// Don't update if only updating the height and we're not visible
		return (this.state.initialHeight === nextState.initialHeight) || this.props.visible || nextProps.visible;
	}

	componentWillUpdate (nextProps, nextState) {
		if (nextState.renderState === TRANSITION_STATE.MEASURE) {
			this.measuringJob.stop();
		}
	}

	componentDidUpdate (prevProps, prevState) {
		const {visible} = this.props;
		const {initialHeight, renderState} = this.state;

		// Checking that something changed that wasn't the visibility
		// or the initialHeight state or checking if component should be visible but doesn't have a height
		if ((visible === prevProps.visible &&
			initialHeight === prevState.initialHeight &&
			renderState !== TRANSITION_STATE.INIT) ||
			(initialHeight == null && visible)) {
			this.measureInner();
		}
	}

	componentWillUnmount () {
		this.measuringJob.stop();
		if (this.context.Subscriber) {
			this.context.Subscriber.unsubscribe('resize', this.handleResize);
		}
	}

	measuringJob = new Job(() => {
		this.setState({
			renderState: TRANSITION_STATE.MEASURE
		});
	})

	handleResize = () => {
		// @TODO oddly, using the setState callback is required here to ensure that the bounds
		// are remeasured in a separate tick
		this.setState({
			initialHeight: null
		}, this.measureInner);
	}

	handleTransitionEnd = (ev) => {
		forwardTransitionEnd(ev, this.props);

		if (ev.target === this.childNode) {
			if (!this.props.visible && this.props.onHide) {
				this.props.onHide(ev);
			} else if (this.props.visible && this.props.onShow) {
				this.props.onShow(ev);
			}
		}
	}

	measureInner = () => {
		if (this.childNode) {
			const initialHeight = this.childNode.scrollHeight;
			if (initialHeight !== this.state.initialHeight) {
				this.setState({
					initialHeight,
					renderState: TRANSITION_STATE.READY
				});
			}
		}
	}

	childRef = (node) => {
		this.childNode = node;
	}

	render () {
		let {visible, ...props} = this.props;
		delete props.onHide;
		delete props.onShow;
		delete props.textSize;

		switch (this.state.renderState) {
			// If we are deferring children, don't render any
			case TRANSITION_STATE.INIT: return null;

			// If we're transitioning to visible but don't have a measurement yet, create the
			// transition container with its children so we can measure. Measuring will cause a
			// state change to trigger the animation.
			case TRANSITION_STATE.MEASURE: return (
				<TransitionBase {...props} childRef={this.childRef} visible={false} />
			);

			case TRANSITION_STATE.READY: return (
				<TransitionBase
					{...props}
					childRef={this.childRef}
					visible={visible}
					clipHeight={this.state.initialHeight}
					onTransitionEnd={this.handleTransitionEnd}
				/>
			);
		}
	}
}

export default Transition;
export {Transition, TransitionBase};
