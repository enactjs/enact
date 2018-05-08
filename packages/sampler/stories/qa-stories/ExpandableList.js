import Button from '@enact/moonstone/Button';
import ExpandableList from '@enact/moonstone/ExpandableList';
import {RadioControllerDecorator} from '@enact/ui/RadioDecorator';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, text, select} from '@storybook/addon-knobs';

const ExpandableGroup = RadioControllerDecorator('div');

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
				<ExpandableList {...this.props}>
					{prop.listArray[this.state.index]}
				</ExpandableList>
			</div>
		);
	}
}

storiesOf('ExpandableList', module)
	.add(
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
				select={select('select', ['radio', 'multiple', 'single'], 'radio')}
				title={text('title', 'title')}
			/>
		)
	)
	.add(
		'grouped',
		() => (
			<ExpandableGroup>
				<ExpandableList title="First">
					{['One', 'Two', 'Three']}
				</ExpandableList>
				<ExpandableList title="Second">
					{['Fourth', 'Fifth', 'Sixth']}
				</ExpandableList>
				<ExpandableList title="Third">
					{['Seventh', 'Eighth', 'Ninth']}
				</ExpandableList>
			</ExpandableGroup>
		)
	)
	.add(
		'with multiples (to test "lockBottom" prop)',
		() => (
			<div>
				<ExpandableList title="First">
					{['One', 'Two', 'Three']}
				</ExpandableList>
				<ExpandableList title="Second (with disabled items)">
					{[
						{key: 1, children: 'a', disabled: true},
						{key: 2, children: 'b'},
						{key: 3, children: 'c', disabled: true},
						{key: 4, children: 'd'},
						{key: 5, children: 'e', disabled: true}
					]}
				</ExpandableList>
				<ExpandableList title="Third">
					{['Seventh', 'Eighth', 'Ninth']}
				</ExpandableList>
			</div>
		)
	);
