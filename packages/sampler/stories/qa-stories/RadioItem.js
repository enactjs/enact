import {RadioItemBase} from '@enact/moonstone/RadioItem';
import {Toggleable} from '@enact/ui/Toggleable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean} from '@kadira/storybook-addon-knobs';

const RadioItem = Toggleable({prop: 'checked'}, RadioItemBase);
RadioItem.displayName = 'RadioItem';
RadioItem.propTypes = Object.assign({}, RadioItem.propTypes, RadioItemBase.propTypes);
RadioItem.defaultProps = Object.assign({}, RadioItem.defaultProps, RadioItemBase.defaultProps);

delete RadioItem.propTypes.checked;
delete RadioItem.propTypes.icon;
delete RadioItem.propTypes.iconClasses;

const radioData = {
	longTextWithSpace : ['FirstLongTextWithSpace FirstLongTextWithSpace FirstLongTextWithSpace FirstLongTextWithSpace', 'SecondLongTextWithSpace SecondLongTextWithSpace SecondLongTextWithSpace SecondLongTextWithSpace'],
	longTextWithoutSpace : ['FirstLongTextWithoutSpace_FirstLongTextWithoutSpace_FirstLongTextWithoutSpace', 'SecondLongTextWithoutSpace_SecondLongTextWithoutSpace_SecondLongTextWithoutSpace_SecondLongTextWithoutSpace'],
	tallText : ['இந்தியா', 'ÃÑÕÂÊÎÔÛÄËÏÖÜŸ'],
	rightToLeft : ['صباح الخير', 'مساء الخير']
};

storiesOf('RadioItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		'Long Text with space',
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
	.addWithInfo(
		'Long Text without space',
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
	.addWithInfo(
		'Tall Text',
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
	.addWithInfo(
		'Right to Left Text',
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
	.addWithInfo(
		'Default Checked',
		() => (
			<div>
				<RadioItem
					disabled={boolean('disabled', false)}
					inline={boolean('inline', false)}
					onToggle={action('onToggle')}
					defaultChecked
				>
					RadioItem1
				</RadioItem>
				<RadioItem
					disabled={boolean('disabled', false)}
					inline={boolean('inline', false)}
					onToggle={action('onToggle')}
					defaultChecked
				>
					RadioItem2
				</RadioItem>
			</div>
		)
	);
