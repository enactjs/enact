import Item, {ItemBase} from '@enact/moonstone/Item';
import React from 'react';
import Button from '@enact/moonstone/Button';
import Image from '@enact/moonstone/Image';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

Item.propTypes = Object.assign({}, ItemBase.propTypes, Item.propTypes);
Item.defaultProps = Object.assign({}, ItemBase.defaultProps, Item.defaultProps);
Item.displayName = 'Item';

const inputData = {
	longText : 'Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Text',
	extraSpaceText : 'This                                                             text                                                                          has                                                                                        extra                                                                         spaces',
	tallText : ['नरेंद्र मोदी', ' ฟิ้  ไั  ஒ  து', 'ÃÑÕÂÊÎÔÛÄËÏÖÜŸ', 'صباح الخير']
};

storiesOf('Item')
	.addDecorator(withKnobs)
	.addWithInfo(
		'with long text',
		() => (
			<Item
				disabled={boolean('disabled')}
			>
				{text('children', inputData.longText)}
			</Item>
		)
	)
	.addWithInfo(
		'with extra spaces',
		() => (
			<Item
				disabled={boolean('disabled')}
			>
				{text('children', inputData.extraSpaceText)}
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
		'integrated with other components',
		() => (
			<Item
				disabled={boolean('disabled')}
			>
				<Button>Click here</Button>
				{text('children', 'Hello Item')}
				<Button>Click here</Button>
				<Image src={'http://lorempixel.com/512/512/city/1/'} sizing='fill' alt='lorempixel' />
				<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</p>
				<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</p>
				<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.</p>
			</Item>
		)
	);
