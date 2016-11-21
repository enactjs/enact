import {SelectableItemBase, SelectableItem} from '@enact/moonstone/SelectableItem';
import {Toggleable} from '@enact/ui/Toggleable';
import Selectable from '@enact/ui/Selectable';
import Group from '@enact/ui/Group';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text, select} from '@kadira/storybook-addon-knobs';


const SelectableGroup = Selectable(Group);

SelectableGroup.displayName = 'SelectableGroup';
SelectableGroup.propTypes = Object.assign({}, Group.propTypes, Selectable.propTypes);
SelectableGroup.defaultProps = Object.assign({}, Group.defaultProps, Selectable.defaultProps);

const SelectableItemToggle = Toggleable({prop: 'selected', mutable: true}, SelectableItemBase);
SelectableItemToggle.displayName = 'SelectableItem';
SelectableItemToggle.propTypes = Object.assign({}, SelectableItemToggle.propTypes, SelectableItemBase.propTypes);
SelectableItemToggle.defaultProps = Object.assign({}, SelectableItemToggle.defaultProps, SelectableItemBase.defaultProps);

delete SelectableItemToggle.propTypes.selected;
delete SelectableItemToggle.defaultProps.selected;

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
				selected={boolean('selected', false)}
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
				selected={boolean('selected', false)}
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
				selected={boolean('selected', false)}
				onToggle={action('onToggle')}
			>
				{text('extra space text', inputData.extraSpaceText)}
			</SelectableItemToggle>
		)
	)
	.addWithInfo(
		'with default selected',
		() => (
			<SelectableItemToggle
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				selected={boolean('selected', true)}
				onToggle={action('onToggle')}
			>
				{text('children', inputData.normalText)}
			</SelectableItemToggle>
		)
	)
	.addWithInfo(
		'that is grouped',
		() => (
			<SelectableGroup
				childComponent={SelectableItem}
				itemProps={{
					inline: boolean('inline', false),
					disabled: boolean('disabled', false)
				}}
				selectedProp="selected"
				onSelect={action('onSelect')}
			>

				{[text('Normal Text 1', inputData.normalText + 1), text('Normal Text 2', inputData.normalText + 2), text('Normal Text 3', inputData.normalText + 3)]}
			</SelectableGroup>
		)
	);
