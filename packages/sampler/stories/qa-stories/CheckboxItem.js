import CheckboxItem from '@enact/moonstone/CheckboxItem';
import ToggleItem from '@enact/moonstone/ToggleItem';
import UiToggleItem, {ToggleItemBase as UiToggleItemBase} from '@enact/ui/ToggleItem';
import Item, {ItemBase} from '@enact/moonstone/Item';
import Group from '@enact/ui/Group';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('CheckboxItem', ItemBase, Item, UiToggleItemBase, UiToggleItem, ToggleItem, CheckboxItem);

const prop = {
	longText : 'Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Text',
	tallText : ['नरेंद्र मोदी', ' ฟิ้  ไั  ஒ  து', 'ÃÑÕÂÊÎÔÛÄËÏÖÜŸ'],
	extraSpaceText : 'This		Text 		has			extra 		space',
	rtlText: 'هناك حقيقة مثبتة منذ زمن طويل وهي'
};

storiesOf('CheckboxItem', module)
	.add(
		'with long text',
		() => (
			<CheckboxItem
				disabled={boolean('disabled', Config, false)}
				iconPosition={select('iconPosition', ['before', 'after'], Config)}
				inline={boolean('inline', Config)}
				onToggle={action('onToggle')}
			>
				{text('children', Config, prop.longText)}
			</CheckboxItem>
		)
	)
	.add(
		'with tall characters',
		() => (
			<CheckboxItem
				disabled={boolean('disabled', Config, false)}
				iconPosition={select('iconPosition', ['before', 'after'], Config)}
				inline={boolean('inline', Config)}
				onToggle={action('onToggle')}
			>
				{select('children', prop.tallText, Config, prop.tallText[0])}
			</CheckboxItem>
		)
	)
	.add(
		'with extra spacing',
		() => (
			<CheckboxItem
				disabled={boolean('disabled', Config, false)}
				iconPosition={select('iconPosition', ['before', 'after'], Config)}
				inline={boolean('inline', Config)}
				onToggle={action('onToggle')}
			>
				{text('children', Config, prop.extraSpaceText)}
			</CheckboxItem>
		)
	)
	.add(
		'with right to left text',
		() => (
			<CheckboxItem
				disabled={boolean('disabled', Config, false)}
				iconPosition={select('iconPosition', ['before', 'after'], Config)}
				inline={boolean('inline', Config)}
				onToggle={action('onToggle')}
			>
				{text('children', Config, prop.rtlText)}
			</CheckboxItem>
		)
	)
	.add(
		'that is grouped',
		() => (
			<Group
				childComponent={CheckboxItem}
				childSelect="onToggle"
				itemProps={{
					inline: boolean('ItemProps-Inline', false)
				}}
				select={select('select', ['single', 'radio', 'multiple'], Group, 'multiple')}
				selectedProp="selected"
				defaultSelected={0}
				onSelect={action('onSelect')}
			>
				{['Checkbox Item 1', 'Checkbox Item 2', 'Checkbox Item 3']}
			</Group>
		)
	);
