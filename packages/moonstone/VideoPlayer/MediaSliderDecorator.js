import {adaptEvent, call, handle, forKey, forward, oneOf, preventDefault, returnsTrue, stopImmediate} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {calcProportion} from '@enact/ui/Slider/utils';
import PropTypes from 'prop-types';
import React from 'react';

import MediaKnob from './MediaKnob';

// decrements the MediaKnob position if we're tracking
const decrement = (state) => {
	if (state.tracking && state.x > 0) {
		const x = Math.max(0, state.x - 0.05);

		return {x};
	}

	return null;
};

// increments the MediaKnob position if we're tracking
const increment = (state) => {
	if (state.tracking && state.x < 1) {
		const x = Math.min(1, state.x + 0.05);

		return {x};
	}

	return null;
};

const handleBlur = handle(
	forward('onBlur'),
	call('untrack')
);

const handleFocus = handle(
	forward('onFocus'),
	// extract target from the event and pass it to track()
	adaptEvent(({target}) => target, call('track'))
);

const handleKeyDown = handle(
	forward('onKeyDown'),
	call('isTracking'),
	// if tracking and the key is left/right update the preview x position
	oneOf(
		[forKey('left'), returnsTrue(call('decrement'))],
		[forKey('right'), returnsTrue(call('increment'))]
	),
	// if we handled left or right, stopImmediate to prevent spotlight handling
	stopImmediate
);

const handleKeyUp = handle(
	forward('onKeyUp'),
	call('isTracking'),
	forKey('enter'),
	// prevent moonstone/Slider from activating the knob
	preventDefault,
	adaptEvent(call('getEventPayload'), forward('onChange'))
);

/**
 * MediaSlider for {@link moonstone/VideoPlayer}.
 *
 * @class MediaSliderDecorator
 * @memberof moonstone/VideoPlayer
 * @hoc
 * @private
 */
const MediaSliderDecorator = hoc((config, Wrapped) => {
	return class extends React.Component {
		static displayName = 'MediaSliderDecorator'

		static propTypes = {
			value: PropTypes.number
		}

		constructor () {
			super();

			this.handleMouseOver = this.handleMouseOver.bind(this);
			this.handleMouseOut = this.handleMouseOut.bind(this);
			this.handleMouseMove = this.handleMouseMove.bind(this);
			this.handleBlur = handleBlur.bind(this);
			this.handleFocus = handleFocus.bind(this);
			this.handleKeyDown = handleKeyDown.bind(this);
			this.handleKeyUp = handleKeyUp.bind(this);

			this.state = {
				maxX: 0,
				minX: 0,
				tracking: false,
				x: 0
			};
		}

		componentDidUpdate (prevProps, prevState) {
			if (prevState.x !== this.state.x) {
				forward('onKnobMove', this.getEventPayload(), this.props);
			}
		}

		getEventPayload () {
			return {
				value: this.state.x,
				proportion: this.state.x
			};
		}

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
						x: calcProportion(state.minX, state.maxX, clientX)
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

		decrement () {
			this.setState(decrement);
		}

		increment () {
			this.setState(increment);
		}

		isTracking () {
			return this.state.tracking;
		}

		handleMouseOver (ev) {
			if (ev.currentTarget.contains(ev.relatedTarget)) {
				return;
			}

			this.track(ev.currentTarget);
			this.move(ev.clientX);
		}

		handleMouseOut (ev) {
			if (ev.currentTarget.contains(ev.relatedTarget)) {
				return;
			}

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
					knobComponent={
						<MediaKnob preview={this.state.tracking} previewProportion={this.state.x} />
					}
					onBlur={this.handleBlur}
					onFocus={this.handleFocus}
					onKeyDown={this.handleKeyDown}
					onKeyUp={this.handleKeyUp}
					onMouseOver={this.handleMouseOver}
					onMouseOut={this.handleMouseOut}
					onMouseMove={this.handleMouseMove}
				/>
			);
		}
	};
});

export default MediaSliderDecorator;
export {
	MediaSliderDecorator
};
