import {adjustEvent, handle, forKey, forward, preventDefault} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {calcPercent} from '@enact/ui/Slider/utils';
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
					knobComponent={
						<MediaKnob tracking={this.state.tracking} trackX={this.state.x} />
					}
					onBlur={this.handleBlur}
					onFocus={this.handleFocus}
					onSpotlightLeft={this.handleLeft}
					onSpotlightRight={this.handleRight}
					onKeyUp={this.handleKeyUp}
					onMouseEnter={this.handleMouseEnter}
					onMouseLeave={this.handleMouseLeave}
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
