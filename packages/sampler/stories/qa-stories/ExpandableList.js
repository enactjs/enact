import Button from '@enact/moonstone/Button';
import ExpandableList from '@enact/moonstone/ExpandableList';
import {RadioControllerDecorator} from '@enact/ui/RadioDecorator';
import Selectable from '@enact/ui/Selectable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text, select} from '@kadira/storybook-addon-knobs';

const ExpandableGroup = RadioControllerDecorator('div');
const SelectableList = Selectable(ExpandableList);

const prop = {
	listArray: [['a', 'b', 'c'], ['c', 'd', 'e', 'f', 'g']]
};

class ExpandableListChildrenLengthUpdate extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			index: 0
		};
	}

	updateValue = () => {
		this.setState({
			index: 1 - this.state.index
		});
	}

	render () {
		return (
			<div>
				<Button onClick={this.updateValue}>update value</Button>
				<SelectableList {...this.props}>
					{prop.listArray[this.state.index]}
				</SelectableList>
			</div>
		);
	}
}

storiesOf('ExpandableList')
	.addDecorator(withKnobs)
	.addWithInfo(
		'with children length update',
		() => (
			<ExpandableListChildrenLengthUpdate
				closeOnSelect={boolean('closeOnSelect', false)}
				disabled={boolean('disabled', false)}
				noAutoClose={boolean('noAutoClose', false)}
				noLockBottom={boolean('noLockBottom', false)}
				noneText={text('noneText', 'nothing selected')}
				onSelect={action('onSelect')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				open={boolean('open', false)}
				select={select('select', ['single', 'radio', 'multiple'], 'single')}
				title={text('title', 'title')}
			/>
		)
	)
	.addWithInfo(
		'grouped',
		() => (
			<ExpandableGroup>
				<SelectableList title="First">
					{['One', 'Two', 'Three']}
				</SelectableList>
				<SelectableList title="Second">
					{['Fourth', 'Fifth', 'Sixth']}
				</SelectableList>
				<SelectableList title="Third">
					{['Seventh', 'Eighth', 'Ninth']}
				</SelectableList>
			</ExpandableGroup>
		)
	)
	.addWithInfo(
		'with multiples (to test "lockBottom" prop)',
		() => (
			<div>
				<SelectableList title="First">
					{['One', 'Two', 'Three']}
				</SelectableList>
				<SelectableList title="Second">
					{['Fourth', 'Fifth', 'Sixth']}
				</SelectableList>
				<SelectableList title="Third">
					{['Seventh', 'Eighth', 'Ninth']}
				</SelectableList>
			</div>
		)
	);
