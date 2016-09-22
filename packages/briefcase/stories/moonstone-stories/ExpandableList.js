import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

import ExpandableList from 'enact-moonstone/ExpandableList';

class StatefulExpandableList extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			open: false
		};
	}

	handleChange = ({value}) => {
		this.setState({
			value: value
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
			<ExpandableList
				title={text('title', 'title')}
				label={this.state.label}
				noneText={text('noneText', 'none text')}
				value={this.state.value}
				disabled={boolean('disabled')}
				open={this.state.open}
				onOpen={this.handleOpen}
				onClose={this.handleClose}
				onChange={this.handleChange}
			>
				{['option1', 'option2']}
			</ExpandableList>
		);
	}
}

storiesOf('ExpandableList')
	.addDecorator(withKnobs)
	.addWithInfo(
		'',
		'Basic usage of ExpandableList',
		() => (
			<StatefulExpandableList />
		),
		{propTables: [ExpandableList]}
	);
