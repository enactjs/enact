/**
 * Exports the {@link module:@enact/ui/Transition~Transition} and {@link module:@enact/ui/Transition~TransitionBase}
 * components.  The default export is {@link module:@enact/ui/Transition~Transition}.
 *
 * @module @enact/ui/Transition
 */

import React, {PropTypes} from 'react';
import kind from '@enact/core/kind';
import {SpotlightContainerDecorator} from 'enact-spotlight';

import css from './Transition.less';

/**
 * {@link module:@enact/ui/Transition~TransitionBase} is a stateless component that allows for applying transitions
 * to its child items via configurable properties and events. In general, you want to use the stateful version,
 * {@link module:@enact/ui/Transition~Transition}.
 *
 * @class TransitionBase
 * @ui
 * @public
 */
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
 * {@link module:@enact/ui/Transition~Transition} is a stateful component that allows for applying transitions
 * to its child items via configurable properties and events.
 *
 * @class Transition
 * @ui
 * @public
 */
class TransitionComponent extends React.Component {
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
		const props = Object.assign({}, this.props);
		const height = props.visible ? this.state.initialHeight : 0;
		props['data-container-disabled'] = !props.visible;
		return (
			<TransitionBase {...props} childRef={this.measureInner} clipHeight={height} />
		);
	}
}

const Transition = SpotlightContainerDecorator(TransitionComponent);

export default Transition;
export {Transition, TransitionBase};
