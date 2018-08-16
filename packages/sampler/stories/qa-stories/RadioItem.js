import RadioItem from '@enact/moonstone/RadioItem';
import ToggleItem from '@enact/moonstone/ToggleItem';
import UiToggleItem, {ToggleItemBase as UiToggleItemBase} from '@enact/ui/ToggleItem';
import Item, {ItemBase} from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {mergeComponentMetadata} from '../../src/utils';
import {boolean} from '../../src/enact-knobs';

RadioItem.displayName = 'RaditoItem';
const Config = mergeComponentMetadata('RadioItem', ItemBase, Item, UiToggleItemBase, UiToggleItem, ToggleItem, RadioItem);

const radioData = {
	longTextWithSpace : ['FirstLongTextWithSpace FirstLongTextWithSpace FirstLongTextWithSpace FirstLongTextWithSpace', 'SecondLongTextWithSpace SecondLongTextWithSpace SecondLongTextWithSpace SecondLongTextWithSpace'],
	longTextWithoutSpace : ['FirstLongTextWithoutSpace_FirstLongTextWithoutSpace_FirstLongTextWithoutSpace', 'SecondLongTextWithoutSpace_SecondLongTextWithoutSpace_SecondLongTextWithoutSpace_SecondLongTextWithoutSpace'],
	tallText : ['இந்தியா', 'ÃÑÕÂÊÎÔÛÄËÏÖÜŸ'],
	rightToLeft : ['صباح الخير', 'مساء الخير']
};

storiesOf('RadioItem', module)
	.add(
		'with long text and spaces',
		() => (
			<div>
				<RadioItem
					disabled={boolean('disabled', Config)}
					inline={boolean('inline', Config)}
					onToggle={action('onToggle')}
				>
					{radioData.longTextWithSpace[0]}
				</RadioItem>
				<RadioItem
					disabled={boolean('disabled', Config)}
					inline={boolean('inline', Config)}
					onToggle={action('onToggle')}
				>
					{radioData.longTextWithSpace[1]}
				</RadioItem>
			</div>
		)
	)
	.add(
		'with long text and no spaces',
		() => (
			<div>
				<RadioItem
					disabled={boolean('disabled', Config)}
					inline={boolean('inline', Config)}
					onToggle={action('onToggle')}
				>
					{radioData.longTextWithoutSpace[0]}
				</RadioItem>
				<RadioItem
					disabled={boolean('disabled', Config)}
					inline={boolean('inline', Config)}
					onToggle={action('onToggle')}
				>
					{radioData.longTextWithoutSpace[1]}
				</RadioItem>
			</div>
		)
	)
	.add(
		'with tall characters',
		() => (
			<div>
				<RadioItem
					disabled={boolean('disabled', Config)}
					inline={boolean('inline', Config)}
					onToggle={action('onToggle')}
				>
					{radioData.tallText[0]}
				</RadioItem>
				<RadioItem
					disabled={boolean('disabled', Config)}
					inline={boolean('inline', Config)}
					onToggle={action('onToggle')}
				>
					{radioData.tallText[1]}
				</RadioItem>
			</div>
		)
	)
	.add(
		'with right to left text',
		() => (
			<div>
				<RadioItem
					disabled={boolean('disabled', Config)}
					inline={boolean('inline', Config)}
					onToggle={action('onToggle')}
				>
					{radioData.rightToLeft[0]}
				</RadioItem>
				<RadioItem
					disabled={boolean('disabled', Config)}
					inline={boolean('inline', Config)}
					onToggle={action('onToggle')}
				>
					{radioData.rightToLeft[1]}
				</RadioItem>
			</div>
		)
	)
	.add(
		'selected by default',
		() => (
			<div>
				<RadioItem
					disabled={boolean('disabled', Config)}
					inline={boolean('inline', Config)}
					onToggle={action('onToggle')}
					defaultSelected
				>
					RadioItem1
				</RadioItem>
				<RadioItem
					disabled={boolean('disabled', Config)}
					inline={boolean('inline', Config)}
					onToggle={action('onToggle')}
					defaultSelected
				>
					RadioItem2
				</RadioItem>
			</div>
		)
	);
