import SelectableItem from '@enact/moonstone/SelectableItem';
import Group from '@enact/ui/Group';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, select, text} from '../../src/enact-knobs';

SelectableItem.displayName = 'SelectableItem';

const inputData = {
	longText : 'Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Text',
	disabledLong : 'Default disabled Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Text',
	tallText : ['नरेंद्र मोदी', ' ฟิ้  ไั  ஒ  து', 'ÃÑÕÂÊÎÔÛÄËÏÖÜŸ'],
	extraSpaceText : 'This                        Text                               has                      extra                                space',
	rtlText : 'هناك حقيقة مثبتة منذ زمن طويل وهي',
	normalText : 'Selectable Item'
};

storiesOf('SelectableItem', module)
	.add(
		'with long text',
		() => (
			<div>
				<SelectableItem
					disabled={boolean('disabled', SelectableItem, false)}
					inline={boolean('inline', SelectableItem, false)}
					onToggle={action('onToggle')}
				>
					{text('Long Text', SelectableItem, inputData.longText)}
				</SelectableItem>
				<SelectableItem
					disabled
					inline={boolean('inline', SelectableItem, false)}
					onToggle={action('onToggle')}
				>
					{text('Disable Long Text', SelectableItem, inputData.disabledLong)}
				</SelectableItem>
			</div>
		)
	)
	.add(
		'with tall characters',
		() => (
			<SelectableItem
				disabled={boolean('disabled', SelectableItem, false)}
				inline={boolean('inline', SelectableItem, false)}
				onToggle={action('onToggle')}
			>
				{select('children', inputData.tallText, SelectableItem, inputData.tallText[0])}
			</SelectableItem>
		)
	)
	.add(
		'with right to left text',
		() => (
			<SelectableItem
				disabled={boolean('disabled', SelectableItem, false)}
				inline={boolean('inline', SelectableItem, false)}
				onToggle={action('onToggle')}
			>
				{text('Right to Left Text', SelectableItem, inputData.rtlText)}
			</SelectableItem>
		)
	)
	.add(
		'with extra spacing',
		() => (
			<SelectableItem
				disabled={boolean('disabled', SelectableItem, false)}
				inline={boolean('inline', SelectableItem, false)}
				onToggle={action('onToggle')}
			>
				{text('extra space text', SelectableItem, inputData.extraSpaceText)}
			</SelectableItem>
		)
	)
	.add(
		'with default selected',
		() => (
			<SelectableItem
				defaultSelected
				disabled={boolean('disabled', SelectableItem, false)}
				inline={boolean('inline', SelectableItem, false)}
				onToggle={action('onToggle')}
			>
				{text('children', SelectableItem, inputData.normalText)}
			</SelectableItem>
		)
	)
	.add(
		'that is grouped',
		() => (
			<Group
				childComponent={SelectableItem}
				itemProps={{
					inline: boolean('inline', SelectableItem, false),
					disabled: boolean('disabled', SelectableItem, false)
				}}
				childSelect="onToggle"
				selectedProp="selected"
				disabled={boolean('disabled', SelectableItem, false)}
				onSelect={action('onSelect')}
			>

				{[
					text('Normal Text 1', SelectableItem, inputData.normalText + 1),
					text('Normal Text 2', SelectableItem, inputData.normalText + 2),
					text('Normal Text 3', SelectableItem, inputData.normalText + 3)
				]}
			</Group>
		)
	)
	.add(
		'that is grouped with individual disabled items',
		() => (
			<Group
				childComponent={SelectableItem}
				childSelect="onToggle"
				selectedProp="selected"
				onSelect={action('onSelect')}
			>
				{[
					{key: 'item1', children: '1', disabled: true},
					{key: 'item2', children: '2', disabled: false},
					{key: 'item3', children: '3', disabled: true},
					{key: 'item4', children: '4', disabled: false}
				]}
			</Group>
		)
	);
