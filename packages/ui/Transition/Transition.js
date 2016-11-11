/**
 * Exports the {@link ui/Transition.Transition} and {@link ui/Transition.TransitionBase}
 * components.  The default export is {@link ui/Transition.Transition}.
 *
 * @module ui/Transition
 */

import React, {PropTypes} from 'react';
import kind from '@enact/core/kind';

import css from './Transition.less';

/**
 * {@link ui/Transition.TransitionBase} is a stateless component that allows for applying transitions
 * to its child items via configurable properties and events. In general, you want to use the stateful version,
 * {@link ui/Transition.Transition}.
 *
 * @class TransitionBase
 * @memberof ui/Transition
 * @ui
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
		 * TODO: disabling warning, remove after https://jira2.lgsvl.com/browse/PLAT-30066
		 * @private
		 */
		classes: PropTypes.any,

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
		 * Supported directions are: up, right, down, left.
		 *
		 * @type {String}
		 * @default 'up'
		 * @public
		 */
		direction: PropTypes.oneOf(['up', 'right', 'down', 'left']),

		/**
		 * Control how long the transition should take.
		 * Supported durations are: short (250ms), long (1s). medium (500ms) is default when no others are specified.
		 *
		 * @type {String}
		 * @default 'medium'
		 * @public
		 */
		duration: PropTypes.oneOf(['short', 'medium', 'long']),

		/**
		 * Customize the transition timing function.
		 * Supported functions are: linear, ease. ease-in-out is the default when none others are specified.
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
		direction: 'up',
		duration: 'medium',
		timingFunction: 'ease-in-out',
		type: 'slide',
		visible: true
	},

	styles: {
		css,
		className: 'transitionFrame',
		prop: 'classes'
	},

	computed: {
		className: ({direction, duration, timingFunction, type, visible, styler}) => styler.join(
			'transition',
			visible ? 'shown' : 'hidden',
			direction && css[direction],
			duration && css[duration],
			timingFunction && css[timingFunction],
			css[type]
		),
		style: ({clipHeight, type, visible}) => ({
			height: ((type === 'clip') && visible) ? clipHeight : null,
			overflow: (type === 'clip') ? 'hidden' : null
		})
	},

	render: ({classes, children, childRef, ...rest}) => {
		delete rest.clipHeight;
		delete rest.direction;
		delete rest.duration;
		delete rest.timingFunction;
		delete rest.type;
		delete rest.visible;

		return (
			<div className={classes}>
				<div {...rest} ref={childRef}>
					{children}
				</div>
			</div>
		);
	}
});

/**
 * {@link ui/Transition.Transition} is a stateful component that allows for applying transitions
 * to its child items via configurable properties and events.
 *
 * @class Transition
 * @memberof ui/Transition
 * @ui
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

	measureInner = (node) => {
		if (node && this.state.initialHeight === null) {
			node.style.height = 'auto';
			const initialHeight = node.getBoundingClientRect().height;
			this.setState({initialHeight});
			node.style.height = null;
		}
	}

	render () {
		const height = this.props.visible ? this.state.initialHeight : 0;
		return (
			<TransitionBase {...this.props} childRef={this.measureInner} clipHeight={height} />
		);
	}
}

export default Transition;
export {Transition, TransitionBase};
