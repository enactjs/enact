import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import Pause from '@enact/spotlight/Pause';
import PropTypes from 'prop-types';
import React from 'react';

import $L from '../internal/$L';

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
// * aria-text handling
//   * use aria-valuetext when set
//   * defaults to value
//   * onActivate, set to hint text
//   * on value change, reset to value or valuetext
// * Spotlight management
//   * pause whend dragging to prevent spotlight from leaving when pointer enters another component
// * managing focused state to show/hide tooltip
const SliderBehaviorDecorator = hoc((config, Wrapped) => {
	return class extends React.Component {
		static displayName = 'SliderBehaviorDecorator'

		static propTypes = {
			'aria-valuetext': PropTypes.oneOf([PropTypes.string, PropTypes.number]),
			orientation: PropTypes.string,
			value: PropTypes.number
		}

		static defaultProps = {
			orientation: 'horizontal'
		}

		constructor () {
			super();

			this.paused = new Pause();
			this.handleActivate = this.handleActivate.bind(this);
			this.handleBlur = this.handleBlur.bind(this);
			this.handleDragEnd = this.handleDragEnd.bind(this);
			this.handleDragStart = this.handleDragStart.bind(this);
			this.handleFocus = this.handleFocus.bind(this);
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

		render () {
			return (
				<Wrapped
					{...this.props}
					active={this.state.active}
					aria-valuetext={this.getValueText()}
					focused={this.state.focused}
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
