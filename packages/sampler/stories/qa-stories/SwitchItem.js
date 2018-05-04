import SwitchItem from '@enact/moonstone/SwitchItem';
import Group from '@enact/ui/Group';
import Divider from '@enact/moonstone/Divider';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {text, boolean} from '@storybook/addon-knobs';

const inputData = {
	longText : 'Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Text',
	disabledLong : 'Default disabled Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Text',
	normalText : 'Switch Item'
};

storiesOf('SwitchItem', module)
	.add(
		'with Long Text',
		() => (
			<div>
				<SwitchItem
					disabled={boolean('disabled', false)}
					inline={boolean('inline', false)}
					onToggle={action('onToggle')}
				>
					{text('Long Text', inputData.longText)}
				</SwitchItem>
				<SwitchItem
					disabled
					inline={boolean('inline', false)}
					onToggle={action('onToggle')}
				>
					{text('Disable Long Text', inputData.disabledLong)}
				</SwitchItem>
			</div>
		)
	)
	.add(
		'Group',
		() => (
			<div>
				<Divider>
					{'Switch items with normal text in a group'}
				</Divider>
				<Group
					childComponent={SwitchItem}
					itemProps={{
						inline: boolean('ItemProps-Inline', false),
						disabled: boolean('disabled', false)
					}}
					selectedProp="selected"
					defaultSelected={1}
					onSelect={action('onSelect')}
				>
					{[text('Normal Text 1', inputData.normalText + 1), text('Normal Text 2', inputData.normalText + 2), text('Normal Text 3', inputData.normalText + 3)]}
				</Group>
				<Divider>
					{'Switch items with long text in a group'}
				</Divider>
				<Group
					childComponent={SwitchItem}
					itemProps={{
						inline: boolean('ItemProps-Inline', false),
						disabled: boolean('disabled', false)
					}}
					selectedProp="selected"
					disabled={boolean('disabled', false)}
					defaultSelected={1}
					onSelect={action('onSelect')}
				>
					{[text('Long Text 1', 'First ' + inputData.longText), text('Long Text 2', 'Second ' + inputData.longText), text('Long Text 3', 'Third ' + inputData.longText)]}
				</Group>
			</div>
		)
	);
