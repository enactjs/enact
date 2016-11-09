import {SwitchItem, SwitchItemBase} from '@enact/moonstone/SwitchItem';
import Selectable from '@enact/ui/Selectable';
import Toggleable from '@enact/ui/Toggleable';
import Group from '@enact/ui/Group';
import Divider from '@enact/moonstone/Divider';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, text, boolean} from '@kadira/storybook-addon-knobs';

const SelectableGroup = Selectable(Group);

SelectableGroup.displayName = 'SelectableGroup';
SelectableGroup.propTypes = Object.assign({}, Group.propTypes, Selectable.propTypes);
SelectableGroup.defaultProps = Object.assign({}, Group.defaultProps, Selectable.defaultProps);

const SwitchItemToggle = Toggleable({prop: 'checked'}, SwitchItemBase);
SwitchItemToggle.propTypes = Object.assign({}, SwitchItemToggle.propTypes, SwitchItemBase.propTypes);
SwitchItemToggle.defaultProps = Object.assign({}, SwitchItemToggle.defaultProps, SwitchItemBase.defaultProps);
SwitchItemToggle.displayName = 'SwitchItem';

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
				<SelectableGroup
					childComponent={SwitchItem}
					itemProps={{
						inline: boolean('ItemProps-Inline', false),
						disabled: boolean('disabled', false)
					}}
					selectedProp='checked'
					defaultSelected={1}
					onSelect={action('onSelect')}
				>
					{[text('Normal Text 1', inputData.normalText + 1), text('Normal Text 2', inputData.normalText + 2), text('Normal Text 3', inputData.normalText + 3)]}
				</SelectableGroup>
				<Divider>
					{'Switch items with long text in a group'}
				</Divider>
				<SelectableGroup
					childComponent={SwitchItem}
					itemProps={{
						inline: boolean('ItemProps-Inline', false),
						disabled: boolean('disabled', false)
					}}
					selectedProp='checked'
					defaultSelected={1}
					onSelect={action('onSelect')}
				>
					{[text('Long Text 1', inputData.longText), text('Long Text 2', inputData.longText), text('Long Text 3', inputData.longText)]}
				</SelectableGroup>
			</div>
		)
	);
