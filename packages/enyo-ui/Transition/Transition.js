import React, {PropTypes} from 'react';
import kind from 'enyo-core/kind';

import css from './Transition.less';

const TransitionBase = kind({

	propTypes: {
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
		 * @default ''
		 * @public
		 */
		duration: PropTypes.oneOf(['short', 'medium', 'long']),

		/**
		 * Customize the transition timing function.
		 * Supported functions are: linear, ease. ease-in-out is the default when none others are specified.
		 *
		 * @type {String}
		 * @default ''
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
		classes: 'transitionFrame'
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

class Transition extends React.Component {
	static propTypes = TransitionBase.propTypes
	static defaultProps = TransitionBase.defaultProps

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
