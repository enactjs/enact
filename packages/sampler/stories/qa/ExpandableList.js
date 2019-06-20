import Button from '@enact/moonstone/Button';
import Divider from '@enact/moonstone/Divider';
import ExpandableList, {ExpandableListBase} from '@enact/moonstone/ExpandableList';
import Scroller from '@enact/moonstone/Scroller';
import {RadioControllerDecorator} from '@enact/ui/RadioDecorator';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, text, select} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('ExpandableList', ExpandableList, ExpandableListBase);

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
		this.setState(({index}) => ({
			index: 1 - index
		}));
	}

	render () {
		return (
			<div>
				<Button onClick={this.updateValue}>update value</Button>
				<Divider />
				<ExpandableList {...this.props}>
					{prop.listArray[this.state.index]}
				</ExpandableList>
			</div>
		);
	}
}

class ExpandableListWithAddedChildren extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			list: []
		};
	}

	setZero = () => {
		this.setState({
			list: []
		});
	}

	setTen = () => {
		this.setState({
			list: ['a', 'b', 'c', 'd', 'e', 'a', 'b', 'c', 'd', 'e']
		});
	}

	render () {
		return (
			<Scroller>
				<Divider>Change the number of items in the list</Divider>
				<Button onClick={this.setZero}>0</Button>
				<Button onClick={this.setTen}>10</Button>
				<ExpandableList title={'test'} defaultOpen>
					{this.state.list}
				</ExpandableList>
			</Scroller>
		);
	}
}

storiesOf('ExpandableList', module)
	.add(
		'with children length update',
		() => (
			<ExpandableListChildrenLengthUpdate
				closeOnSelect={boolean('closeOnSelect', Config)}
				disabled={boolean('disabled', Config)}
				noAutoClose={boolean('noAutoClose', Config)}
				noLockBottom={boolean('noLockBottom', Config)}
				noneText={text('noneText', Config, 'nothing selected')}
				onSelect={action('onSelect')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				select={select('select', ['radio', 'multiple', 'single'], Config, 'radio')}
				title="with children length update"
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
	)
	.add(
		'with default selected',
		() => (
			<Scroller>
				<ExpandableList title="Default Selected" defaultSelected={2}>
					{['Option 1', 'Option 2', 'Option 3']}
				</ExpandableList>
				<ExpandableList title="Multiple Selected" select="multiple" defaultSelected={[1, 2]}>
					{['Option 1', 'Option 2', 'Option 3']}
				</ExpandableList>
				<ExpandableList title="Long Contents Selected" select="multiple" defaultSelected={[17, 18, 19]}>
					{optionsArray}
				</ExpandableList>
			</Scroller>
		)
	)
	.add(
		'with added children',
		() => (
			<ExpandableListWithAddedChildren />
		)
	)
	.add(
		'no onClose handler',
		() => (
			<ExpandableList
				open
				title="ExpandableList"
				noAutoClose
			>
				{['children1', 'children2', 'children3']}
			</ExpandableList>
		)
	);
