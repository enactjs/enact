import {ExpandableList as ExpList, ExpandableListBase} from '@enact/moonstone/ExpandableList';
import {forward} from '@enact/core/handle';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

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

	handleSelect = (ev) => {
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
				value={this.state.value}
				open={this.state.open}
				onOpen={this.handleOpen}
				onClose={this.handleClose}
				onSelect={this.handleSelect}
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
				disabled={boolean('disabled', false)}
				noneText={text('noneText', 'nothing selected')}
				onChange={action('onChange')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				open={boolean('open', false)}
				select={select('select', ['none', 'single', 'radio', 'multiple'], 'none')}
				title={text('title', 'title')}
			>
				{['option1', 'option2', 'option3']}
			</ExpandableList>
		)
	);
