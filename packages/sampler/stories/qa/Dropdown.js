import Dropdown, {DropdownBase} from '@enact/moonstone/Dropdown';
import Button, {ButtonBase} from '@enact/moonstone/Button';
import Heading from '@enact/moonstone/Heading';
import UIButton, {ButtonBase as UIButtonBase} from '@enact/ui/Button';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {boolean, select, text} from '@enact/storybook-utils/addons/knobs';
import {action} from '@enact/storybook-utils/addons/actions';
import {mergeComponentMetadata} from '@enact/storybook-utils';

const Config = mergeComponentMetadata('Dropdown', UIButtonBase, UIButton, ButtonBase, Button, DropdownBase, Dropdown);
const items = (itemCount, optionText = 'Option') => (new Array(itemCount)).fill().map((i, index) => `${optionText} ${index + 1}`);

Dropdown.displayName = 'Dropdown';

const list = [
	{children: 'hello 1', 'key': 'key1', 'aria-label': 'aria 1'},
	{children: 'hello 2', 'key': 'key2', 'aria-label': 'aria 2', disabled: true},
	{children: 'hello 3', 'key': 'key3', 'aria-label': 'aria 3'}
];

class AutoDismissDropdown extends React.Component {
	constructor (props) {
		super(props);
		this.state = {
			open: true
		};
	}

	handleClose = () => {
		this.setState({open: false});
	}

	render () {
		return (
			<div>
				<Heading>Click in the blank area of the viewport to dismiss the Dropdown</Heading>
				<Dropdown
					onClose={this.handleClose}
					open={this.state.open} // initial value is true
				>
					{['test1', 'test2', 'test3']}
				</Dropdown>
			</div>
		);
	}
}

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
				width={select('width', ['tiny', 'small', 'medium', 'large', 'x-large', 'huge'], Config)}
			>
				{['Option 1', 'Option 2']}
			</Dropdown>
		)
	).add(
		'with defaultSelected in 20 options',
		() => (
			<Dropdown
				defaultSelected={10}
				direction={select('direction', ['up', 'down'], Config)}
				disabled={boolean('disabled', Config)}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				onSelect={action('onSelect')}
				size={select('size', ['small', 'large'], Config)}
				title={text('title', Config, 'Dropdown')}
				width={select('width', ['tiny', 'small', 'medium', 'large', 'x-large', 'huge'], Config)}
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
				width={select('width', ['tiny', 'small', 'medium', 'large', 'x-large', 'huge'], Config)}
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
					width={select('width', ['tiny', 'small', 'medium', 'large', 'x-large', 'huge'], Config)}
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
					width={select('width', ['tiny', 'small', 'medium', 'large', 'x-large', 'huge'], Config)}
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
					width={select('width', ['tiny', 'small', 'medium', 'large', 'x-large', 'huge'], Config)}
				>
					{list}
				</Dropdown>
			</div>
		)
	).add(
		'with auto dismiss',
		() => (
			<AutoDismissDropdown />
		)
	);
