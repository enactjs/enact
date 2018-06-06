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

const optionsArray = [];

for (let i = 0; i < 21; i++) {
	optionsArray.push(`Option ${i + 1}`);
}

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
		'with default selected',
		() => (
			<div>
				<ExpandableList title="Default Selected" selected={2}>
					{['Option 1', 'Option 2', 'Option 3']}
				</ExpandableList>
				<ExpandableList title="Multiple Selected" select="multiple" selected={[1, 2]}>
					{['Option 1', 'Option 2', 'Option 3']}
				</ExpandableList>
				<ExpandableList title="Long Contents Selected" select="multiple" selected={[17, 18, 19]}>
					{optionsArray}
				</ExpandableList>
			</div>
		)
	);
