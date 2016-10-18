import ExpandableDayPicker from '@enact/moonstone/ExpandableDayPicker';
import {forward} from '@enact/core/handle';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

class StatefulExpandableDayPicker extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			open: false
		};
		this.forwardOnSelect = forward('onSelect');
	}

	handleSelect = (ev) => {
		this.setState({
			label: ev.selected
		});
		this.forwardOnSelect(ev, this.props);
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
				label={this.state.label}
				open={this.state.open}
				onOpen={this.handleOpen}
				onClose={this.handleClose}
				onSelect={this.handleSelect}
				multiple
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
