import {SwitchItem, SwitchItemBase} from '@enact/moonstone/SwitchItem';
import Changeable from '@enact/ui/Changeable';
import Toggleable from '@enact/ui/Toggleable';
import Group from '@enact/ui/Group';
import Divider from '@enact/moonstone/Divider';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, text, boolean} from '@kadira/storybook-addon-knobs';

const ChangeableGroup = Changeable({change: 'onSelect', prop: 'selected'}, Group);
const SwitchItemToggle = Toggleable({prop: 'selected'}, SwitchItemBase);

const inputData = {
	longText : 'Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Text',
	disabledLong : 'Default disabled Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Text',
	normalText : 'Switch Item'
};

storiesOf('SwitchItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		'with Long Text',
		() => (
			<div>
				<SwitchItemToggle
					disabled={boolean('disabled', false)}
					inline={boolean('inline', false)}
					onToggle={action('onToggle')}
				>
					{text('Long Text', inputData.longText)}
				</SwitchItemToggle>
				<SwitchItemToggle
					disabled
					inline={boolean('inline', false)}
					onToggle={action('onToggle')}
				>
					{text('Disable Long Text', inputData.disabledLong)}
				</SwitchItemToggle>
			</div>
		)
	)
	.addWithInfo(
		'Group',
		() => (
			<div>
				<Divider>
					{'Switch items with normal text in a group'}
				</Divider>
				<ChangeableGroup
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
				</ChangeableGroup>
				<Divider>
					{'Switch items with long text in a group'}
				</Divider>
				<ChangeableGroup
					childComponent={SwitchItem}
					itemProps={{
						inline: boolean('ItemProps-Inline', false),
						disabled: boolean('disabled', false)
					}}
					selectedProp="selected"
					defaultSelected={1}
					onSelect={action('onSelect')}
				>
					{[text('Long Text 1', 'First ' + inputData.longText), text('Long Text 2', 'Second ' + inputData.longText), text('Long Text 3', 'Third ' + inputData.longText)]}
				</ChangeableGroup>
			</div>
		)
	);
