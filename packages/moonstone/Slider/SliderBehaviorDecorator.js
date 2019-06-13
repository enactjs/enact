import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import platform from '@enact/core/platform';
import Pause from '@enact/spotlight/Pause';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';
import React from 'react';

import $L from '../internal/$L';

import {forwardSpotlightEvents} from './utils';

const useHintOnActive = ({active}) => {
	return {
		useHintText: active
	};
};

const toggleActive = ({active}) => {
	return {
		active: !active
	};
};

const defaultConfig = {
	// FIXME: This is a compromise to maintain a single decorator for Slider and IncrementSlider
	// that handles both a consolidated focus state and spotlight directional event mgmt. When this
	// is unset (for Slider), this decorator will listen to onKeyDown and fire spotlight events.
	// When set (for IncrementSlider), it specifies the event that is passed down to trigger
	// spotlight events and also doesn't remove the spotlight directional callbacks from the props
	// so the Wrapped component can fire them manually or use the callback for the default behavior.
	emitSpotlightEvents: null
};

// Adds moonstone-specific slider behaviors
// * aria-valuetext handling
//   * use aria-valuetext when set
//   * defaults to current value
//   * onActivate, set to hint text
//   * on value change, reset to value or aria-valuetext
// * Spotlight
//   * Pause Spotlight when dragging to prevent spotlight from leaving when pointer enters another
//     component
//   * Forward directional spotlight events from slider
// * Managing focused state to show/hide tooltip
const SliderBehaviorDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {emitSpotlightEvents} = config;

	return class extends React.Component {
		static displayName = 'SliderBehaviorDecorator'

		static propTypes = {
			'aria-valuetext': PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
			disabled: PropTypes.bool,
			max: PropTypes.number,
			min: PropTypes.number,
			orientation: PropTypes.string,
			value: PropTypes.number
		}

		static defaultProps = {
			max: 100,
			min: 0,
			orientation: 'horizontal'
		}

		constructor (props) {
			super(props);

			this.paused = new Pause();
			this.handleActivate = this.handleActivate.bind(this);
			this.handleBlur = this.handleBlur.bind(this);
			this.handleDragEnd = this.handleDragEnd.bind(this);
			this.handleDragStart = this.handleDragStart.bind(this);
			this.handleFocus = this.handleFocus.bind(this);
			this.handleSpotlightEvents = this.handleSpotlightEvents.bind(this);
			this.bounds = {};

			this.state = {
				active: false,
				dragging: false,
				focused: false,
				useHintText: false,
				prevValue: props.value
			};
		}

		static getDerivedStateFromProps (props, state) {
			if (props.value !== state.prevValue) {
				return {
					useHintText: false,
					prevValue: props.value
				};
			}
			return null;
		}

		componentDidUpdate (prevProps, prevState) {
			// on touch platforms, we want sliders to focus when dragging begins
			if (platform.touch && this.state.dragging && !prevState.dragging) {
				const thisNode = findDOMNode(this); // eslint-disable-line react/no-find-dom-node
				const sliderNode = thisNode.getAttribute('role') === 'slider' ? thisNode : thisNode.querySelector('[role="slider"]');
				sliderNode.focus();
			}
		}

		componentWillUnmount () {
			this.paused.resume();
		}

		getValueText () {
			const {'aria-valuetext': ariaValueText, min, orientation, value = min} = this.props;
			const {useHintText} = this.state;

			const verticalHint = $L('change a value with up down button');
			const horizontalHint = $L('change a value with left right button');

			if (useHintText) {
				return orientation === 'horizontal' ? horizontalHint : verticalHint;
			}

			if (ariaValueText != null) {
				return ariaValueText;
			}

			return value;
		}

		handleActivate () {
			forward('onActivate', {type: 'onActivate'}, this.props);
			this.setState(toggleActive);
			this.setState(useHintOnActive);
		}

		handleBlur (ev) {
			forward('onBlur', ev, this.props);
			this.setState({focused: false});
		}

		handleDragStart () {
			this.paused.pause();
			this.setState({dragging: true});
		}

		handleDragEnd () {
			this.paused.resume();
			this.setState({dragging: false});
		}

		handleFocus (ev) {
			if (!this.props.disabled) {
				forward('onFocus', ev, this.props);
				this.setState({focused: true});
			}
		}

		handleSpotlightEvents (ev) {
			if (!emitSpotlightEvents) {
				forward('onKeyDown', ev, this.props);
			}

			forwardSpotlightEvents(ev, this.props);
		}

		render () {
			const props = Object.assign({}, this.props);

			if (!emitSpotlightEvents) {
				// Remove spotlight props before hitting spottable since we've handled them uniquely
				delete props.onSpotlightLeft;
				delete props.onSpotlightRight;
				delete props.onSpotlightUp;
				delete props.onSpotlightDown;

				props.onKeyDown = this.handleSpotlightEvents;
			} else {
				props[emitSpotlightEvents] = this.handleSpotlightEvents;
			}

			return (
				<Wrapped
					role="slider"
					{...props}
					active={this.state.active}
					aria-valuetext={this.getValueText()}
					focused={this.state.focused || this.state.dragging}
					onActivate={this.handleActivate}
					onBlur={this.handleBlur}
					onDragStart={this.handleDragStart}
					onDragEnd={this.handleDragEnd}
					onFocus={this.handleFocus}
				/>
			);
		}
	};
});

export default SliderBehaviorDecorator;
export {
	SliderBehaviorDecorator
};
