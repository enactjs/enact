import Item, {ItemBase} from '@enact/moonstone/Item';
import {Icon, icons} from '@enact/moonstone/Icon';
import React from 'react';
import Button from '@enact/moonstone/Button';
import Image from '@enact/moonstone/Image';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

Item.propTypes = Object.assign({}, ItemBase.propTypes, Item.propTypes);
Item.defaultProps = Object.assign({}, ItemBase.defaultProps, Item.defaultProps);
Item.displayName = 'Item';

const iconNames = ['', ...Object.keys(icons)];

const inputData = {
	longText : 'Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Text',
	extraSpaceText : 'This                                                             text                                                                          has                                                                                        extra                                                                         spaces',
	tallText : ['नरेंद्र मोदी', ' ฟิ้  ไั  ஒ  து', 'ÃÑÕÂÊÎÔÛÄËÏÖÜŸ', 'صباح الخير'],
	disabledText : 'This text is disabled',
	normalText : 'Item with text that is spottable'
};

storiesOf('Item')
	.addDecorator(withKnobs)
	.addWithInfo(
		'with long text',
		() => (
			<Item
				disabled={boolean('disabled')}
			>
				{text('Children', inputData.longText)}
			</Item>
		)
	)
	.addWithInfo(
		'with tall characters',
		() => (
			<Item
				disabled={boolean('disabled')}
			>
				{select('value', inputData.tallText,  inputData.tallText[2])}
			</Item>
		)
	)
	.addWithInfo(
		'with extra spaces',
		() => (
			<Item
				disabled={boolean('disabled')}
			>
				{text('Children', inputData.extraSpaceText)}
			</Item>
		)
	)
	.addWithInfo(
		'integrated with other components',
		() => (
			<Item
				disabled={boolean('disabled')}
			>
				<Button>Click here</Button>
				{text('Children', 'Hello Item')}
				<Button>Click here</Button>
				<Image src={'http://lorempixel.com/512/512/city/1/'} sizing='fill' alt='lorempixel' />
				<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</p>
				<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</p>
				<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</p>
			</Item>
		)
	)
	.addWithInfo(
		'sample for spotability test',
		() => (
			<div>
				<Item
				>
					{text('Spottable Text', inputData.normalText)}
				</Item>
				<Item
					disabled
				>
					{text('Disabled Text', inputData.disabledText)}
				</Item>
				<Item
				>
					<Icon
						small={boolean('small')}
					>
						{select('iconstart', ['', ...iconNames], 'plus')}
					</Icon>

					{text('Text with icon at start', 'Item with text that is spottable with an icon (at the start of the string)')}
				</Item>
				<Item
				>
					{text('Text with icon at end', 'Item with text that is spottable with an icon(at the end of the string)')}
					<Icon
						small={boolean('small')}
					>
						{select('iconend', ['', ...iconNames], 'pauseforward')}
					</Icon>
				</Item>
				<Item
				>
					<Icon
						small={boolean('small')}
					>
						{select('icon1 in item', ['', ...iconNames], 'gear')}
					</Icon>
					<Icon
						small={boolean('small')}
					>
						{select('icon2 in item', ['', ...iconNames], 'minus')}
					</Icon>
					<Icon
						small={boolean('small')}
					>
						{select('icon3 in item', ['', ...iconNames], 'trash')}
					</Icon>
					<Icon
						small={boolean('small')}
					>
						{select('icon4 in item', ['', ...iconNames], 'flag')}
					</Icon>
				</Item>
			</div>
		)
	);
