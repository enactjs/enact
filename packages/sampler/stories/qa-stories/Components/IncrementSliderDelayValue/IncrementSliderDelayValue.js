import React from 'react';
import {IncrementSlider} from '@enact/moonstone/IncrementSlider';
import {checkDefaultBounds} from '@enact/ui/validators/PropTypeValidators';

class IncrementSliderDelayValue extends React.Component {
	static displayName: 'IncrementSliderDelayValue';

	static propTypes = {
		backgroundPercent: React.PropTypes.number,
		decrementIcon: React.PropTypes.string,
		disabled: React.PropTypes.bool,
		incrementIcon: React.PropTypes.string,
		max: React.PropTypes.number,
		min: React.PropTypes.number,
		step: React.PropTypes.number,
		value: checkDefaultBounds,
		vertical: React.PropTypes.bool,
		wait: React.PropTypes.number,
	};

	static defaultProps: {
		backgroundPercent: 0,
		max: 100,
		min: 0,
		pressed: false,
		step: 1,
		value: 0,
		vertical: false,
		wait: 1000
	};

	constructor (props) {
		super(props);
		this.state = {
			value: props.value,
			count: 0
		};
	}

	changeValue() {
		if(this.state.count < 4) {
			if(this.state.value == 100) {
				this.setState({value: 0});
			} else {
				this.setState({value: 100});
			}
			this.setState({value: value + 1});
		}
	}

	componentDidMount () {
		setInterval(this.changeValue.bind(this), 10000);
	}
	
	render () {
		return (
			<div>
				<IncrementSlider
					value={this.state.value}
				/>
			</div>
		);
	}
}

export default IncrementSliderDelayValue;