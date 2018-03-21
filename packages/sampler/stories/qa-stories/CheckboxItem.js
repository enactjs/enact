import CheckboxItem from '@enact/moonstone/CheckboxItem';
import Group from '@enact/ui/Group';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, text, select} from '@storybook/addon-knobs';

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
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{text('children', prop.longText)}
			</CheckboxItem>
		)
	)
	.add(
		'with tall characters',
		() => (
			<CheckboxItem
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{select('children', prop.tallText, prop.tallText[0])}
			</CheckboxItem>
		)
	)
	.add(
		'with extra spacing',
		() => (
			<CheckboxItem
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{text('children', prop.extraSpaceText)}
			</CheckboxItem>
		)
	)
	.add(
		'with right to left text',
		() => (
			<CheckboxItem
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{text('children', prop.rtlText)}
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
				select={select('select', ['single', 'radio', 'multiple'], 'multiple')}
				selectedProp="selected"
				defaultSelected={0}
				onSelect={action('onSelect')}
			>
				{['Checkbox Item 1', 'Checkbox Item 2', 'Checkbox Item 3']}
			</Group>
		)
	);
