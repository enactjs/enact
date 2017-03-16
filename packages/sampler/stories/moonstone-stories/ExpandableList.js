import ExpandableList from '@enact/moonstone/ExpandableList';
import Selectable from '@enact/ui/Selectable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

const List = Selectable(ExpandableList);
List.displayName = 'ExpandableList';

const myObjects2 = [
	{
		disabled: true,
		children: 'off'
		// visible: true
	},
	{
		disabled: false,
		children: 'smooth'
		// visible: true
	},
	{
		// disabled: false,
		children: 'clear'
		// visible: true
	},
	{
		// disabled: false,
		children: 'clearPlus'
		// visible: true
	},
	{
		disabled: true,
		children: 'user'
		// visible: false
	}
];


storiesOf('ExpandableList')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of ExpandableList',
		() => (
			<List
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
				kids={myObjects2}
			/>
		)
	);
				// {['option1', 'option2', 'option3']}
