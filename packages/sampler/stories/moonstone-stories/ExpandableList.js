import {ExpandableList as ExpList, ExpandableListBase} from '@enact/moonstone/ExpandableList';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {boolean, text} from '@kadira/storybook-addon-knobs';

class ExpandableList extends React.Component {
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
			<ExpList
				{...this.props}
				label={this.state.label}
				value={this.state.value}
				open={this.state.open}
				onOpen={this.handleOpen}
				onClose={this.handleClose}
				onChange={this.handleChange}
			/>
		);
	}
}

ExpandableList.propTypes = Object.assign({}, ExpList.propTypes, ExpandableListBase.propTypes);
ExpandableList.defaultProps = Object.assign({}, ExpList.defaultProps, ExpandableListBase.defaultProps);

storiesOf('ExpandableList')
	.addWithInfo(
		' ',
		'Basic usage of ExpandableList',
		() => (
			<ExpandableList
				title={text('title', 'title')}
				noneText={text('noneText', 'nothing selected')}
				disabled={boolean('disabled', false)}
			>
				{['option1', 'option2', 'option3']}
			</ExpandableList>
		)
	);
