/**
 * Exports the {@link ui/Transition.Transition} and {@link ui/Transition.TransitionBase}
 * components.  The default export is {@link ui/Transition.Transition}.
 *
 * @module ui/Transition
 */

import {forward} from '@enact/core/handle';
import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

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
		childRef: ({childRef, noAnimation}) => noAnimation ? null : childRef
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
					{children}
				</div>
			);
		}
	}
});

/**
 * {@link ui/Transition.Transition} is a stateful component that allows for applying transitions
 * to its child items via configurable properties and events.
 *
 * @class Transition
 * @memberof ui/Transition
 * @public
 */
class Transition extends React.Component {
	static propTypes = /** @lends ui/Transition.Transition.prototype */ {
		children: PropTypes.node.isRequired,

		/**
		 * A callback function to get the reference to the child node (the one with the content) at
		 * render time. Useful if you need to measure or interact with the node directly.
		 *
		 * @type {Function}
		 * @default null
		 * @private
		 */
		childRef: PropTypes.func,

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

	constructor () {
		super();

		this.state = {
			initialHeight: null
		};
	}

	componentDidUpdate (prevProps) {
		if (this.props.visible === prevProps.visible) {
			this.measureInner();
		}
	}

	hideDidFinish = (ev) => {
		forwardTransitionEnd(ev, this.props);
		if (!this.props.visible && this.props.onHide) {
			this.props.onHide();
		}
	}

	measureInner () {
		if (this.childNode) {
			const initialHeight = this.childNode.scrollHeight;
			if (initialHeight !== this.state.initialHeight) {
				this.setState({initialHeight});
			}
		}
	}

	childRef = (node) => {
		this.childNode = node;
		if (this.state.initialHeight === null) {
			this.measureInner();
		}
	}

	render () {
		const props = Object.assign({}, this.props);
		delete props.onHide;

		const height = props.visible ? this.state.initialHeight : 0;
		return (
			<TransitionBase {...props} childRef={this.childRef} clipHeight={height} onTransitionEnd={this.hideDidFinish} />
		);
	}
}

export default Transition;
export {Transition, TransitionBase};
