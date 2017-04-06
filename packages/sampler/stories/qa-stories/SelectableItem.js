import SelectableItem from '@enact/moonstone/SelectableItem';
import Group from '@enact/ui/Group';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text, select} from '@kadira/storybook-addon-knobs';

const inputData = {
	longText : 'Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Text',
	disabledLong : 'Default disabled Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Text',
	tallText : ['नरेंद्र मोदी', ' ฟิ้  ไั  ஒ  து', 'ÃÑÕÂÊÎÔÛÄËÏÖÜŸ'],
	extraSpaceText : 'This                        Text                               has                      extra                                space',
	rtlText : 'هناك حقيقة مثبتة منذ زمن طويل وهي',
	normalText : 'Selectable Item'
};

storiesOf('SelectableItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		'with long text',
		() => (
			<div>
				<SelectableItem
					disabled={boolean('disabled', false)}
					inline={boolean('inline', false)}
					onToggle={action('onToggle')}
				>
					{text('Long Text', inputData.longText)}
				</SelectableItem>
				<SelectableItem
					disabled
					inline={boolean('inline', false)}
					onToggle={action('onToggle')}
				>
					{text('Disable Long Text', inputData.disabledLong)}
				</SelectableItem>
			</div>
		)
	)
	.addWithInfo(
		'with tall characters',
		() => (
			<SelectableItem
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{select('children', inputData.tallText, inputData.tallText[0])}
			</SelectableItem>
		)
	)
	.addWithInfo(
		'with right to left text',
		() => (
			<SelectableItem
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{text('Right to Left Text', inputData.rtlText)}
			</SelectableItem>
		)
	)
	.addWithInfo(
		'with extra spacing',
		() => (
			<SelectableItem
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{text('extra space text', inputData.extraSpaceText)}
			</SelectableItem>
		)
	)
	.addWithInfo(
		'with default selected',
		() => (
			<SelectableItem
				defaultSelected
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{text('children', inputData.normalText)}
			</SelectableItem>
		)
	)
	.addWithInfo(
		'that is grouped',
		() => (
			<Group
				childComponent={SelectableItem}
				itemProps={{
					inline: boolean('inline', false),
					disabled: boolean('disabled', false)
				}}
				selectedProp="selected"
				onSelect={action('onSelect')}
			>

				{[text('Normal Text 1', inputData.normalText + 1), text('Normal Text 2', inputData.normalText + 2), text('Normal Text 3', inputData.normalText + 3)]}
			</Group>
		)
	);
