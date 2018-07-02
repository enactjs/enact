import SwitchItem from '@enact/moonstone/SwitchItem';
import Group from '@enact/ui/Group';
import Divider from '@enact/moonstone/Divider';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, text} from '../../src/enact-knobs';

SwitchItem.displayName = 'SwitchItem';

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
					disabled={boolean('disabled', SwitchItem, false)}
					inline={boolean('inline', SwitchItem, false)}
					onToggle={action('onToggle')}
				>
					{text('Long Text', SwitchItem, inputData.longText)}
				</SwitchItem>
				<SwitchItem
					disabled
					inline={boolean('inline', SwitchItem, false)}
					onToggle={action('onToggle')}
				>
					{text('Disable Long Text', SwitchItem, inputData.disabledLong)}
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
						inline: boolean('ItemProps-Inline', SwitchItem, false),
						disabled: boolean('disabled', SwitchItem, false)
					}}
					selectedProp="selected"
					defaultSelected={1}
					onSelect={action('onSelect')}
				>
					{[text('Normal Text 1', SwitchItem, inputData.normalText + 1), text('Normal Text 2', SwitchItem, inputData.normalText + 2), text('Normal Text 3', SwitchItem, inputData.normalText + 3)]}
				</Group>
				<Divider>
					{'Switch items with long text in a group'}
				</Divider>
				<Group
					childComponent={SwitchItem}
					itemProps={{
						inline: boolean('ItemProps-Inline', SwitchItem, false),
						disabled: boolean('disabled', SwitchItem, false)
					}}
					childSelect="onToggle"
					selectedProp="selected"
					disabled={boolean('disabled', SwitchItem, false)}
					defaultSelected={1}
					onSelect={action('onSelect')}
				>
					{[text('Long Text 1', SwitchItem, 'First ' + inputData.longText), text('Long Text 2', SwitchItem, 'Second ' + inputData.longText), text('Long Text 3', SwitchItem, 'Third ' + inputData.longText)]}
				</Group>
			</div>
		)
	);
