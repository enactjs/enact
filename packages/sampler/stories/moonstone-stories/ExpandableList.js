import {ExpandableList as ExpList, ExpandableListBase} from '@enact/moonstone/ExpandableList';
import {forward} from '@enact/core/handle';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

class ExpandableList extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			open: false
		};
		this.forwardOnChange = forward('onChange');
		this.forwardOnOpen = forward('onOpen');
		this.forwardOnClose = forward('onClose');
	}

	handleChange = (ev) => {
		this.setState({
			value: ev.value
		});
		this.forwardOnChange(ev, this.props);
	}

	handleOpen = (ev) => {
		this.setState({
			'open': true
		});
		this.forwardOnOpen(ev, this.props);
	};

	handleClose = (ev) => {
		this.setState({
			'open': false
		});
		this.forwardOnClose(ev, this.props);
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
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of ExpandableList',
		() => (
			<ExpandableList
				onChange={action('onChange')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				title={text('title', 'title')}
				noneText={text('noneText', 'nothing selected')}
				disabled={boolean('disabled', false)}
			>
				{['option1', 'option2', 'option3']}
			</ExpandableList>
		)
	);
