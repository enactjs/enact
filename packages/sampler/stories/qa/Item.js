import Item from '@enact/moonstone/Item';
import Icon, {icons} from '@enact/moonstone/Icon';
import React from 'react';
import Button from '@enact/moonstone/Button';
import Image from '@enact/moonstone/Image';
import {storiesOf} from '@storybook/react';

import {boolean, select, text} from '../../src/enact-knobs';

const iconNames = ['', ...Object.keys(icons)];

const inputData = {
	longText : 'Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Text',
	extraSpaceText : 'This                                                             text                                                                          has                                                                                        extra                                                                         spaces',
	tallText : ['नरेंद्र मोदी', ' ฟิ้  ไั  ஒ  து', 'ÃÑÕÂÊÎÔÛÄËÏÖÜŸ', 'صباح الخير'],
	disabledText : 'This text is disabled',
	normalText : 'Item with text that is spottable'
};

Item.displayName = 'Item';
Icon.displayName = 'Icon';

storiesOf('Item', module)
	.add(
		'with long text',
		() => (
			<Item disabled={boolean('disabled', Item)}>
				{text('Children', Item, inputData.longText)}
			</Item>
		)
	)
	.add(
		'with tall characters',
		() => (
			<Item disabled={boolean('disabled', Item)}>
				{select('value', inputData.tallText, Item, inputData.tallText[2])}
			</Item>
		)
	)
	.add(
		'with extra spaces',
		() => (
			<Item disabled={boolean('disabled', Item)}>
				{text('Children', Item, inputData.extraSpaceText)}
			</Item>
		)
	)
	.add(
		'integrated with other components',
		() => (
			<Item disabled={boolean('disabled', Item)}>
				<Button>Click here</Button>
				{text('Children', Item, 'Hello Item')}
				<Button>Click here</Button>
				<Image src="http://lorempixel.com/512/512/city/1/" sizing="fill" alt="lorempixel" />
				<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</p>
				<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</p>
				<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</p>
			</Item>
		)
	)
	.add(
		'sample for spotability test',
		() => (
			<div>
				<Item>
					{text('Spottable Text', Item, inputData.normalText)}
				</Item>
				<Item disabled>
					{text('Disabled Text', Item, inputData.disabledText)}
				</Item>
				<Item>
					<Icon
				size={select('size', ['small', 'medium'], Config)}}>
						{select('iconBefore', iconNames, Item, 'plus')}
					</Icon>
					{text('Text with iconBefore', Item, 'Item with text that is spottable with an icon (at the start of the string)')}
				</Item>
				<Item>
					{text('Text with iconAfter', Item, 'Item with text that is spottable with an icon(at the end of the string)')}
					<Icon
				size={select('size', ['small', 'medium'], Config)}}>
						{select('iconAfter', iconNames, Item, 'pauseforward')}
					</Icon>
				</Item>
				<Item>
					<Icon
				size={select('size', ['small', 'medium'], Config)}}>gear</Icon>
					<Icon
				size={select('size', ['small', 'medium'], Config)}}>minus</Icon>
					<Icon
				size={select('size', ['small', 'medium'], Config)}}>trash</Icon>
					<Icon
				size={select('size', ['small', 'medium'], Config)}}>flag</Icon>
				</Item>
			</div>
		)
	);
