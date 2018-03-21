import RadioItem from '@enact/moonstone/RadioItem';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean} from '@storybook/addon-knobs';

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
					disabled={boolean('disabled', false)}
					inline={boolean('inline', false)}
					onToggle={action('onToggle')}
				>
					{radioData.longTextWithSpace[0]}
				</RadioItem>
				<RadioItem
					disabled={boolean('disabled', false)}
					inline={boolean('inline', false)}
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
					disabled={boolean('disabled', false)}
					inline={boolean('inline', false)}
					onToggle={action('onToggle')}
				>
					{radioData.longTextWithoutSpace[0]}
				</RadioItem>
				<RadioItem
					disabled={boolean('disabled', false)}
					inline={boolean('inline', false)}
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
					disabled={boolean('disabled', false)}
					inline={boolean('inline', false)}
					onToggle={action('onToggle')}
				>
					{radioData.tallText[0]}
				</RadioItem>
				<RadioItem
					disabled={boolean('disabled', false)}
					inline={boolean('inline', false)}
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
					disabled={boolean('disabled', false)}
					inline={boolean('inline', false)}
					onToggle={action('onToggle')}
				>
					{radioData.rightToLeft[0]}
				</RadioItem>
				<RadioItem
					disabled={boolean('disabled', false)}
					inline={boolean('inline', false)}
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
					disabled={boolean('disabled', false)}
					inline={boolean('inline', false)}
					onToggle={action('onToggle')}
					defaultSelected
				>
					RadioItem1
				</RadioItem>
				<RadioItem
					disabled={boolean('disabled', false)}
					inline={boolean('inline', false)}
					onToggle={action('onToggle')}
					defaultSelected
				>
					RadioItem2
				</RadioItem>
			</div>
		)
	);
