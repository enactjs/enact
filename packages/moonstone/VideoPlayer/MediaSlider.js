import kind from '@enact/core/kind';
import {adjustEvent, handle, forKey, forward, oneOf, preventDefault} from '@enact/core/handle';
import React from 'react';
import PropTypes from 'prop-types';
import {Knob} from '@enact/ui/Slider';
import {calcPercent} from '@enact/ui/Slider/utils';

import Slider from '../Slider';

import css from './VideoPlayer.less';

/**
 * MediaSlider for {@link moonstone/VideoPlayer}.
 *
 * @class MediaSlider
 * @memberof moonstone/VideoPlayer
 * @ui
 * @private
 */
const MediaSliderBase = kind({
	name: 'MediaSlider',

	propTypes: /** @lends moonstone/VideoPlayer.MediaSlider.prototype */ {
		/**
		 * Background progress, as a proportion from `0` to `1`.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		backgroundProgress: PropTypes.number,

		/**
		 * When `true`, the component is shown as disabled and does not generate events.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * When `true`, the knob will expand. Note that Slider is a controlled
		 * component. Changing the value would only affect pressed visual and
		 * not the state.
		 *
		 * @type {Boolean}
		 * @public
		 */
		forcePressed: PropTypes.bool,

		/**
		 * The handler to run when the value is changed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @param {Number} event.value Value of the slider
		 * @public
		 */
		onChange: PropTypes.func,

		/**
		 * The value of the slider.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		value: PropTypes.number,

		/**
		 * The visibility of the component. When `false`, the component will be hidden.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		visible: PropTypes.bool
	},

	defaultProps: {
		visible: true
	},

	styles: {
		css,
		className: 'sliderFrame'
	},

	computed: {
		className: ({styler, visible}) => styler.append({hidden: !visible}),
		sliderClassName: ({styler, forcePressed}) => styler.join({
			pressed: forcePressed,
			mediaSlider: true
		})
	},

	render: ({className, sliderClassName, ...rest}) => {
		delete rest.forcePressed;
		delete rest.visible;

		return (
			<div className={className}>
				<Slider
					{...rest}
					aria-hidden="true"
					className={sliderClassName}
					css={css}
					knobStep={0.05}
					max={1}
					min={0}
					step={0.00001}
				/>
			</div>
		);
	}
});

const MediaKnob = kind({
	name: 'MediaKnob',

	propTypes: {
		proportion: PropTypes.number,
		tracking: PropTypes.bool,
		trackX: PropTypes.number,
		value: PropTypes.number
	},

	render: ({proportion, tracking, trackX, value, ...rest}) => {
		if (tracking) {
			proportion = value = trackX;
		}

		return (
			<Knob
				{...rest}
				value={value}
				proportion={proportion}
			/>
		);
	}
});

const decrement = (state) => {
	if (state.tracking && state.x > 0) {
		const x = Math.max(0, state.x - 0.05);

		return {x};
	}

	return null;
};

const increment = (state) => {
	if (state.tracking && state.x < 1) {
		const x = Math.min(1, state.x + 0.05);

		return {x};
	}

	return null;
};

const MediaSliderDecorator = (Wrapped) => class extends React.Component {
	static displayName = 'MediaSliderDecorator'

	static propTypes = {
		value: PropTypes.number
	}

	constructor () {
		super();

		this.handleMouseEnter = this.handleMouseEnter.bind(this);
		this.handleMouseLeave = this.handleMouseLeave.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);

		this.state = {
			maxX: 0,
			minX: 0,
			tracking: false,
			x: 0
		};
	}

	getEventPayload = () => ({
		value: this.state.x,
		proportion: this.state.x
	})

	track (target) {
		const bounds = target.getBoundingClientRect();

		this.setState({
			maxX: bounds.right,
			minX: bounds.left,
			tracking: true,
			x: this.props.value
		});
	}

	move (clientX) {
		this.setState((state) => {
			if (clientX >= state.minX && clientX <= state.maxX) {
				return {
					x: calcPercent(state.minX, state.maxX, clientX)
				};
			}
		});
	}

	untrack () {
		this.setState({
			maxX: 0,
			minX: 0,
			tracking: false
		});
	}

	handle = handle.bind(this)

	handleBlur = this.handle(
		forward('onBlur'),
		() =>  this.untrack()
	)

	handleFocus = this.handle(
		forward('onFocus'),
		(ev) =>  this.track(ev.target)
	)

	handleLeft = this.handle(
		() => this.state.tracking,
		preventDefault,
		adjustEvent(this.getEventPayload, forward('onKnobMove')),
		() => this.setState(decrement)
	)

	handleRight = this.handle(
		() => this.state.tracking,
		preventDefault,
		adjustEvent(this.getEventPayload, forward('onKnobMove')),
		() => this.setState(increment)
	)

	handleKeyUp = this.handle(
		forward('onKeyUp'),
		() => this.state.tracking,
		forKey('enter'),
		adjustEvent(this.getEventPayload, forward('onChange'))
	)

	handleMouseEnter (ev) {
		this.track(ev.currentTarget);
		this.move(ev.clientX);
	}

	handleMouseLeave () {
		this.untrack();
	}

	handleMouseMove (ev) {
		this.move(ev.clientX);
	}

	render () {
		const props = Object.assign({}, this.props);

		delete props.onKnobMove;

		return (
			<Wrapped
				{...props}
				onBlur={this.handleBlur}
				onFocus={this.handleFocus}
				onSpotlightLeft={this.handleLeft}
				onSpotlightRight={this.handleRight}
				onKeyUp={this.handleKeyUp}
				onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}
				onMouseMove={this.handleMouseMove}
				knob={
					<MediaKnob tracking={this.state.tracking} trackX={this.state.x} />
				}
			/>
		);
	}
};

const MediaSlider = MediaSliderDecorator(MediaSliderBase);

export default MediaSlider;
export {
	MediaSlider,
	MediaSliderBase
};
