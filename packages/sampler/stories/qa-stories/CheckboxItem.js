import {CheckboxItem, CheckboxItemBase} from '@enact/moonstone/CheckboxItem';
import Group from '@enact/ui/Group';
import Selectable from '@enact/ui/Selectable';
import {Toggleable} from '@enact/ui/Toggleable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text, select} from '@kadira/storybook-addon-knobs';

const CheckboxItemToggle = Toggleable({prop: 'selected', mutable: true}, CheckboxItemBase);
CheckboxItemToggle.displayName = 'CheckboxItem';
CheckboxItemToggle.propTypes = Object.assign({}, CheckboxItemToggle.propTypes, CheckboxItemBase.propTypes);
CheckboxItemToggle.defaultProps = Object.assign({}, CheckboxItemToggle.defaultProps, CheckboxItemBase.defaultProps);

const SelectableGroup = Selectable(Group);

SelectableGroup.displayName = 'SelectableGroup';
SelectableGroup.propTypes = Object.assign({}, Group.propTypes, Selectable.propTypes);
SelectableGroup.defaultProps = Object.assign({}, Group.defaultProps, Selectable.defaultProps);

const prop = {
	longText : 'Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Text',
	tallText : ['नरेंद्र मोदी', ' ฟิ้  ไั  ஒ  து', 'ÃÑÕÂÊÎÔÛÄËÏÖÜŸ'],
	extraSpaceText : 'This		Text 		has			extra 		space',
	rtlText: 'هناك حقيقة مثبتة منذ زمن طويل وهي'
};

storiesOf('CheckboxItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		'with long text',
		() => (
			<CheckboxItemToggle
				selected={boolean('selected', false)}
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{text('children', prop.longText)}
			</CheckboxItemToggle>
		)
	)
	.addWithInfo(
		'with tall characters',
		() => (
			<CheckboxItemToggle
				selected={boolean('selected', false)}
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{select('children', prop.tallText, prop.tallText[0])}
			</CheckboxItemToggle>
		)
	)
	.addWithInfo(
		'with extra spacing',
		() => (
			<CheckboxItemToggle
				selected={boolean('selected', false)}
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{text('children', prop.extraSpaceText)}
			</CheckboxItemToggle>
		)
	)
	.addWithInfo(
		'with right to left text',
		() => (
			<CheckboxItemToggle
				selected={boolean('selected', false)}
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{text('children', prop.rtlText)}
			</CheckboxItemToggle>
		)
	)
	.addWithInfo(
		'that is grouped',
		() => (
			<SelectableGroup
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
			</SelectableGroup>
		)
	);
