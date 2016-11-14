import {SelectableItemBase, SelectableItem} from '@enact/moonstone/SelectableItem';
import {Toggleable} from '@enact/ui/Toggleable';
import Selectable from '@enact/ui/Selectable';
import Divider from '@enact/moonstone/Divider';
import Group from '@enact/ui/Group';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text, select} from '@kadira/storybook-addon-knobs';


const SelectableGroup = Selectable(Group);

SelectableGroup.displayName = 'SelectableGroup';
SelectableGroup.propTypes = Object.assign({}, Group.propTypes, Selectable.propTypes);
SelectableGroup.defaultProps = Object.assign({}, Group.defaultProps, Selectable.defaultProps);

const SelectableItemToggle = Toggleable({prop: 'checked', mutable: true}, SelectableItemBase);
SelectableItemToggle.displayName = 'SelectableItem';
SelectableItemToggle.propTypes = Object.assign({}, SelectableItemToggle.propTypes, SelectableItemBase.propTypes);
SelectableItemToggle.defaultProps = Object.assign({}, SelectableItemToggle.defaultProps, SelectableItemBase.defaultProps);

delete SelectableItemToggle.propTypes.checked;
delete SelectableItemToggle.defaultProps.checked;

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
				<SelectableItemToggle
					disabled={boolean('disabled', false)}
					inline={boolean('inline', false)}
					onToggle={action('onToggle')}
				>
					{text('Long Text', inputData.longText)}
				</SelectableItemToggle>
				<SelectableItemToggle
					disabled
					inline={boolean('inline', false)}
					onToggle={action('onToggle')}
				>
					{text('Disable Long Text', inputData.disabledLong)}
				</SelectableItemToggle>
			</div>
		)
	)
	.addWithInfo(
		'with tall characters',
		() => (
				<SelectableItemToggle
					disabled={boolean('disabled', false)}
					inline={boolean('inline', false)}
					checked={boolean('checked', false)}
					onToggle={action('onToggle')}
				>
				{select('children', inputData.tallText, inputData.tallText[0])}
				</SelectableItemToggle>
		)
	)
	.addWithInfo(
		'with right to left text',
		() => (
				<SelectableItemToggle
					disabled={boolean('disabled', false)}
					inline={boolean('inline', false)}
					checked={boolean('checked', false)}
					onToggle={action('onToggle')}
				>
				{text('Right to Left Text', inputData.rtlText)}
				</SelectableItemToggle>
		)
	)
	.addWithInfo(
		'with extra spacing',
		() => (
				<SelectableItemToggle
					disabled={boolean('disabled', false)}
					inline={boolean('inline', false)}
					checked={boolean('checked', false)}
					onToggle={action('onToggle')}
				>
				{text('extra space text', inputData.extraSpaceText)}
				</SelectableItemToggle>
		)
	)
	.addWithInfo(
		'with default checked',
		() => (
				<SelectableItemToggle
					disabled={boolean('disabled', false)}
					inline={boolean('inline', false)}
					checked={boolean('checked', true)}
					onToggle={action('onToggle')}
				>
				{text('children', inputData.normalText)}
				</SelectableItemToggle>
		)
	)
	.addWithInfo(
		'that is grouped',
		() => (
			<div>
				<Divider>
					{'Selectable items with normal text in a group'}
				</Divider>
				<SelectableGroup
					childComponent={SelectableItem}
					itemProps={{
						inline: boolean('inline', false),
						disabled: boolean('disabled', false)
					}}
					selectedProp="checked"
					defaultSelected={1}
					onSelect={action('onSelect')}
				>
					{['Selectable Item 1', 'Selectable Item 2', 'Selectable Item 3']}
				</SelectableGroup>
				<Divider>
					{'Selectable items with long text in a group'}
				</Divider>
				<SelectableGroup
					childComponent={SelectableItem}
					itemProps={{
						inline: boolean('inline', false),
						disabled: boolean('disabled', false)
					}}
					selectedProp="checked"
					defaultSelected={1}
					onSelect={action('onSelect')}
				>
					{[text('Long Text 1', 'First ' + inputData.longText), text('Long Text 2', 'Second ' + inputData.longText), text('Long Text 3', 'Third ' + inputData.longText)]}
				</SelectableGroup>
			</div>
		)
	);
