import ExpandableGroup from '@enact/moonstone/ExpandableGroup';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

class StatefulExpandableGroup extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			open: false
		};
	}

	handleSelect = ({data}) => {
		this.setState({
			value: data
		});
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
			<ExpandableGroup
				{...this.props}
				value={this.state.value}
				open={this.state.open}
				onOpen={this.handleOpen}
				onClose={this.handleClose}
				onSelect={this.handleSelect}
			/>
		);
	}
}

storiesOf('ExpandableGroup')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of ExpandableGroup',
		() => (
			<StatefulExpandableGroup title='title' noneText='none'>
				{['option1', 'option2', 'option3']}
			</StatefulExpandableGroup>
		)
	);
