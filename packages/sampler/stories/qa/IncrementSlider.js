import IncrementSliderDelayValue from './components/IncrementSliderDelayValue';
import React from 'react';
import IncrementSlider from '@enact/moonstone/IncrementSlider';
import Button from '@enact/moonstone/Button';
import ri from '@enact/ui/resolution';
import {storiesOf} from '@storybook/react';

class IncrementSliderView extends React.Component {

	constructor (props) {
		super(props);
		this.state = {
			value: 0
		};
	}

	handleChange = (ev) => {
		setTimeout(() => {
			this.setState({value: ev.value});
		}, 200);
	}

	render () {
		return (
			<div style={{display: 'flex', marginTop: ri.unit(180, 'rem')}}>
				<div style={{width: '300px'}}>
					<Button>button</Button>
					<Button>button</Button>
				</div>
				<IncrementSlider style={{flex: 1, width: ri.unit(510, 'rem')}} onChange={this.handleChange} value={this.state.value} />
			</div>
		);
	}
}

storiesOf('IncrementSlider', module)
	.add(
		'PLAT-28221',
		() => (
			<div>
				Focus on one of the IncrementSlider buttons. Every 5 seconds, the value will toggle between 0 and 100. Ensure that focus does not leave the IncrementSlider when this happens.
				<IncrementSliderDelayValue />
			</div>
		)
	)
	.add(
		'spotlight behavior while dragging',
		() => (
			<div>
				While holding down the knob (dragging), move the cursor quickly between knob and SliderButtons. Ensure the buttons do not receive spotlight.
				<IncrementSliderView />
			</div>
		)
	);
