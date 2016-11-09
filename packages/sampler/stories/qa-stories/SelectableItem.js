import {SelectableItemBase, SelectableItem} from '@enact/moonstone/SelectableItem';
import {Toggleable} from '@enact/ui/Toggleable';
import Selectable from '@enact/ui/Selectable';
import Divider from '@enact/moonstone/Divider';
import Group from '@enact/ui/Group';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';


const SelectableGroup = Selectable(Group);

SelectableGroup.displayName = 'SelectableGroup';
SelectableGroup.propTypes = Object.assign({}, Group.propTypes, Selectable.propTypes);
SelectableGroup.defaultProps = Object.assign({}, Group.defaultProps, Selectable.defaultProps);

const SelectableItemToggle = Toggleable({prop: 'checked'}, SelectableItemBase);
SelectableItemToggle.displayName = 'SelectableItem';
SelectableItemToggle.propTypes = Object.assign({}, SelectableItemToggle.propTypes, SelectableItemBase.propTypes);
SelectableItemToggle.defaultProps = Object.assign({}, SelectableItemToggle.defaultProps, SelectableItemBase.defaultProps);

delete SelectableItemToggle.propTypes.checked;
delete SelectableItemToggle.defaultProps.checked;

const inputData = {
	longText : 'Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Text',
	disabledLong : 'Default disabled Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Text',
	normalText : 'Selectable Item'
};

storiesOf('SelectableItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		'with Long Text',
		() => (
			<div>
				<SelectableItemToggle
					disabled={boolean('disabled', false)}
					inline={boolean('inline', false)}
					onToggle={action('onToggle')}
				>
					{text('Enabled text', inputData.longText)}
				</SelectableItemToggle>
				<SelectableItemToggle
					disabled
					inline={boolean('inline', false)}
					onToggle={action('onToggle')}
				>
					{text('Disabled text', inputData.disabledLong)}
				</SelectableItemToggle>
			</div>
		)
	)
	.addWithInfo(
		'Group',
		() => (
			<div>
				<Divider>
					{'Selectable items with normal text in a group'}
				</Divider>
				<SelectableGroup
					childComponent={SelectableItem}
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
					{'Selectable items with long text in a group'}
				</Divider>
				<SelectableGroup
					childComponent={SelectableItem}
					itemProps={{
						inline: boolean('ItemProps-Inline', false),
						disabled: boolean('disabled', false)
					}}
					selectedProp='checked'
					defaultSelected={1}
					onSelect={action('onSelect')}
				>
					{[text('Long Text 1', 'First ' + inputData.longText), text('Long Text 2', 'Second ' + inputData.longText), text('Long Text 3', 'Third ' + inputData.longText)]}
				</SelectableGroup>
			</div>
		)
	);
