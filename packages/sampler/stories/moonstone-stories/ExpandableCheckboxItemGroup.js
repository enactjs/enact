import ExpandableCheckboxItemGroup from '@enact/moonstone/ExpandableCheckboxItemGroup';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

class StatefulExpandableCheckboxItemGroup extends React.Component {
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
			<ExpandableCheckboxItemGroup
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

storiesOf('ExpandableCheckboxItemGroup')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of ExpandableCheckboxItemGroup',
		() => (
			<StatefulExpandableCheckboxItemGroup title={text('title', 'title')} noneText={text('none', 'none')}>
				{['option1', 'option2', 'option3']}
			</StatefulExpandableCheckboxItemGroup>
		)
	);
