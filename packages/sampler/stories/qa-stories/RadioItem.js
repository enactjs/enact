import {RadioItemBase} from '@enact/moonstone/RadioItem';
import {Toggleable} from '@enact/ui/Toggleable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select} from '@kadira/storybook-addon-knobs';

const RadioItem = Toggleable({prop: 'checked'}, RadioItemBase);
RadioItem.displayName = 'RadioItem';
RadioItem.propTypes = Object.assign({}, RadioItem.propTypes, RadioItemBase.propTypes);
RadioItem.defaultProps = Object.assign({}, RadioItem.defaultProps, RadioItemBase.defaultProps);

delete RadioItem.propTypes.checked;
delete RadioItem.propTypes.icon;
delete RadioItem.propTypes.iconClasses;

const radioData = {
	checkList: ['None', 'First RadioItem', 'Second RadioItem', 'Both RadioItem'],
	smallText: ['Text With Space', 'Text Without Space'],
	longText1 : ['PNEUMONOULTRAMICROSCOPICSILICOVOLCANOCONIOSISPNEUMONOULTRAMICROSCOPICSILICOVOLCANOCONIOSISNEUM', 'PNEUMONOUL TRAMICROSCOPICSILICO VOLCANOCONIOSISP NEUMONOULTRAMIC ROSCOPICSILICOVOLCANOCONIOSIS'],
	longText2 : ['LOPADOTEMACHOSELACHOGALEOKRANIOLEIPSANLOPADOTEMACHOSELACHOGALEOKRANIOLEIPSAN', 'LOPADOTEMACHOSELACHOGALEOKRANIOLEIPSAN LOPADOTEMACHOSELACHOGALEOKRANIOLEIPSAN LOPADOTEMACHOSELACHOGALEOKRANIOLEIPSAN'],
	tallText : ['இந்தியா', 'ÃÑÕÂÊÎÔÛÄËÏÖÜŸ'],
	rightToLeft : ['صباح الخير', 'مساء الخير']
};

storiesOf('RadioItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		'Long Text',
		() => (
			<div>
				<RadioItem
					disabled={boolean('disabled', false)}
					inline={boolean('inline', false)}
					onToggle={action('onToggle')}
				>
					{select('Space', radioData.smallText, radioData.smallText[0]) === radioData.smallText[1] ? radioData.longText1[0] : radioData.longText1[1]}
				</RadioItem>
				<RadioItem
					disabled={boolean('disabled', false)}
					inline={boolean('inline', false)}
					onToggle={action('onToggle')}
				>
					{select('Space', radioData.smallText, radioData.smallText[0]) === radioData.smallText[1] ? radioData.longText2[0] : radioData.longText2[1]}
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
