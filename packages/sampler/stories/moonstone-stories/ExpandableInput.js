import {ExpandableInput as ExpInput, ExpandableInputBase} from '@enact/moonstone/ExpandableInput';
import {forward} from '@enact/core/handle';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

class ExpandableInput extends React.Component {
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
			open: true
		});
		this.forwardOnOpen(ev, this.props);
	}

	handleClose = (ev) => {
		this.setState({
			open: false
		});
		this.forwardOnClose(ev, this.props);
	}

	render () {
		return (
			<ExpInput
				{...this.props}
				value={this.state.value}
				open={this.state.open}
				onOpen={this.handleOpen}
				onClose={this.handleClose}
				onChange={this.handleSelect}
			/>
		);
	}
}

ExpandableInput.propTypes = Object.assign({}, ExpInput.propTypes, ExpandableInputBase.propTypes);
ExpandableInput.defaultProps = Object.assign({}, ExpInput.defaultProps, ExpandableInputBase.defaultProps);

storiesOf('ExpandableInput')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of ExpandableInput',
		() => (
			<ExpandableInput
				disabled={boolean('disabled', false)}
				noneText={text('noneText', 'nothing selected')}
				onChange={action('onChange')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				open={boolean('open', false)}
				title={text('title', 'title')}
			/>
		)
	);
