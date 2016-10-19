import ExpandableDayPicker from '@enact/moonstone/ExpandableDayPicker';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

class StatefulExpandableDayPicker extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			open: false
		};
	}

	handleOpen = () => {
		this.setState({
			'open': true
		});
	};

	handleClose = () => {
		this.setState({
			'open': false
		});
	};

	render () {
		return (
			<ExpandableDayPicker
				{...this.props}
				open={this.state.open}
				onOpen={this.handleOpen}
				onClose={this.handleClose}
			/>
		);
	}
}

StatefulExpandableDayPicker.displayName = 'ExpandableDayPicker';

storiesOf('ExpandableDayPicker')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of ExpandableDayPicker',
		() => (
			<StatefulExpandableDayPicker
				title={text('title', 'Expandable Day Picker')}
				noneText={text('none', 'none')}
				disabled={boolean('disabled', false)}
				onSelect={action('onSelect')}
			/>
		)
	);
