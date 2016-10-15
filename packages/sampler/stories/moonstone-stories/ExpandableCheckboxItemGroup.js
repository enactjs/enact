import ExpandableCheckboxItemGroup from '@enact/moonstone/ExpandableCheckboxItemGroup';
import {forward} from '@enact/core/handle';
import Selectable from '@enact/ui/Selectable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

const SelectableExpandableCheckboxItemGroup = Selectable(ExpandableCheckboxItemGroup);

class StatefulExpandableCheckboxItemGroup extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			open: false
		};
		this.forwardOnClose = forward('onClose');
		this.forwardOnOpen = forward('onOpen');
		this.forwardOnSelect = forward('onSelect');
	}

	handleSelect = (ev) => {
		this.setState({
			value: ev.data
		});
		this.forwardOnSelect(ev, this.props);
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
			<SelectableExpandableCheckboxItemGroup
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

StatefulExpandableCheckboxItemGroup.displayName = 'ExpandableCheckboxItemGroup';
StatefulExpandableCheckboxItemGroup.propTypes = Object.assign({}, ExpandableCheckboxItemGroup.propTypes);
StatefulExpandableCheckboxItemGroup.defaultProps = Object.assign({}, ExpandableCheckboxItemGroup.defaultProps);

storiesOf('ExpandableCheckboxItemGroup')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of ExpandableCheckboxItemGroup',
		() => (
			<StatefulExpandableCheckboxItemGroup
				title={text('title', 'title')}
				noneText={text('none', 'none')}
				disabled={boolean('disabled', false)}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				onSelect={action('onSelect')}
			>
				{['option1', 'option2', 'option3']}
			</StatefulExpandableCheckboxItemGroup>
		)
	);
