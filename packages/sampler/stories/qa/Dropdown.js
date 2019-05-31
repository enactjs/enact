import Dropdown, {DropdownBase} from '@enact/moonstone/Dropdown';
import Button, {ButtonBase} from '@enact/moonstone/Button';
import UIButton, {ButtonBase as UIButtonBase} from '@enact/ui/Button';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('Dropdown', UIButtonBase, UIButton, ButtonBase, Button, DropdownBase, Dropdown);
const items = (itemCount, optionText = 'Option') => (new Array(itemCount)).fill().map((i, index) => `${optionText} ${index + 1}`);

Dropdown.displayName = 'Dropdown';

const list = [
	{children: 'hello 1', 'key': 'key1', 'aria-label': 'aria 1'},
	{children: 'hello 2', 'key': 'key2', 'aria-label': 'aria 2', disabled: true},
	{children: 'hello 3', 'key': 'key3', 'aria-label': 'aria 3'}
];

storiesOf('Dropdown', module)
	.add(
		'with 2 options for testing direction',
		() => (
			<Dropdown
				direction={select('direction', ['up', 'down'], Config)}
				disabled={boolean('disabled', Config)}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				onSelect={action('onSelect')}
				size={select('size', ['small', 'large'], Config)}
				title={text('title', Config, 'Dropdown')}
				style={{position: 'absolute', top: 'calc(50% - 4rem)'}}
			>
				{['Option 1', 'Option 2']}
			</Dropdown>
		)
	).add(
		'with defaultSelected in 20 options',
		() => (
			<Dropdown
				direction={select('direction', ['up', 'down'], Config)}
				disabled={boolean('disabled', Config)}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				onSelect={action('onSelect')}
				size={select('size', ['small', 'large'], Config)}
				title={text('title', Config, 'Dropdown')}
				defaultSelected={10}
			>
				{items(30)}
			</Dropdown>
		)
	).add(
		'with long text',
		() => (
			<Dropdown
				direction={select('direction', ['up', 'down'], Config)}
				disabled={boolean('disabled', Config)}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				onSelect={action('onSelect')}
				size={select('size', ['small', 'large'], Config)}
				title={text('title', Config, 'Dropdown')}
			>
				{items(10, 'Looooooooooooooooooooooong')}
			</Dropdown>
		)
	).add(
		'with multiple dropdowns',
		() => (
			<div>
				<Dropdown
					direction={select('direction', ['up', 'down'], Config)}
					disabled={boolean('disabled', Config)}
					onClose={action('onClose')}
					onOpen={action('onOpen')}
					onSelect={action('onSelect')}
					size={select('size', ['small', 'large'], Config)}
					title={text('title', Config, 'Dropdown')}
					style={{position: 'absolute', top: 'calc(50% - 4rem)'}}
				>
					{items(5)}
				</Dropdown>
				<Dropdown
					direction={select('direction', ['up', 'down'], Config)}
					disabled={boolean('disabled', Config)}
					onClose={action('onClose')}
					onOpen={action('onOpen')}
					onSelect={action('onSelect')}
					size={select('size', ['small', 'large'], Config)}
					title={text('title', Config, 'Dropdown')}
				>
					{items(5)}
				</Dropdown>
			</div>
		)
	).add(
		'with array of children objects',
		() => (
			<div>
				<Dropdown
					direction={select('direction', ['up', 'down'], Config)}
					disabled={boolean('disabled', Config)}
					onClose={action('onClose')}
					onOpen={action('onOpen')}
					onSelect={action('onSelect')}
					size={select('size', ['small', 'large'], Config)}
					title={text('title', Config, 'Dropdown')}
					style={{position: 'absolute', top: 'calc(50% - 4rem)'}}
				>
					{list}
				</Dropdown>
			</div>
		)
	);
