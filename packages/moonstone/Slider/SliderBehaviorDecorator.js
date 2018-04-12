import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import Pause from '@enact/spotlight/Pause';
import PropTypes from 'prop-types';
import React from 'react';

import $L from '../internal/$L';

import {forwardSpotlightEvents} from './utils';

const useHintOnActivate = ({active}) => {
	return {
		useHintText: active
	};
};

const toggleActivate = ({active}) => {
	return {
		active: !active
	};
};

// Adds moonstone-specific slider behaviors
// * aria-valuetext handling
//   * use aria-valuetext when set
//   * defaults to current value
//   * onActivate, set to hint text
//   * on value change, reset to value or aria-valuetext
// * Pause Spotlight when dragging to prevent spotlight from leaving when pointer enters another
//   component
// * Managing focused state to show/hide tooltip
const SliderBehaviorDecorator = hoc((config, Wrapped) => {
	return class extends React.Component {
		static displayName = 'SliderBehaviorDecorator'

		static propTypes = {
			'aria-valuetext': PropTypes.oneOf([PropTypes.string, PropTypes.number]),
			max: PropTypes.number,
			min: PropTypes.number,
			orientation: PropTypes.string,
			value: PropTypes.number
		}

		static defaultProps = {
			max: 100,
			min: 0,
			orientation: 'horizontal',
			value: 0
		}

		constructor () {
			super();

			this.paused = new Pause();
			this.handleActivate = this.handleActivate.bind(this);
			this.handleBlur = this.handleBlur.bind(this);
			this.handleDragEnd = this.handleDragEnd.bind(this);
			this.handleDragStart = this.handleDragStart.bind(this);
			this.handleFocus = this.handleFocus.bind(this);
			this.handleKeyDown = this.handleKeyDown.bind(this);
			this.bounds = {};

			this.state = {
				active: false,
				focused: false,
				useHintText: false
			};
		}

		componentWillReceiveProps (nextProps) {
			if (this.props.value !== nextProps.value) {
				this.setState({useHintText: false});
			}
		}

		componentWillUnmount () {
			this.paused.resume();
		}

		getValueText () {
			const {'aria-valuetext': ariaValueText, orientation, value} = this.props;
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
			this.setState(toggleActivate);
			this.setState(useHintOnActivate);
		}

		handleBlur (ev) {
			forward('onBlur', ev, this.props);
			this.setState({focused: false});
		}

		handleDragStart () {
			this.paused.pause();
		}

		handleDragEnd () {
			this.paused.resume();
		}

		handleFocus (ev) {
			forward('onFocus', ev, this.props);
			this.setState({focused: true});
		}

		handleKeyDown (ev) {
			forward('onKeyDown', ev, this.props);
			forwardSpotlightEvents(ev, this.props);
		}

		render () {
			const props = Object.assign({}, this.props);

			// Remove spotlight props before hitting spottable since we've handled them uniquely
			delete props.onSpotlightLeft;
			delete props.onSpotlightRight;
			delete props.onSpotlightUp;
			delete props.onSpotlightDown;

			return (
				<Wrapped
					{...props}
					active={this.state.active}
					aria-valuetext={this.getValueText()}
					focused={this.state.focused}
					onActivate={this.handleActivate}
					onBlur={this.handleBlur}
					onDragStart={this.handleDragStart}
					onDragEnd={this.handleDragEnd}
					onFocus={this.handleFocus}
					onKeyDown={this.handleKeyDown}
				/>
			);
		}
	};
});

export default SliderBehaviorDecorator;
export {
	SliderBehaviorDecorator
};
