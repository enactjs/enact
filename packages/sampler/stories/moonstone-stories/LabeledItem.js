import Item, {ItemBase} from 'enact-moonstone/Item';
import LabeledItem from 'enact-moonstone/LabeledItem';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, boolean} from '@kadira/storybook-addon-knobs';

LabeledItem.propTypes = Object.assign({}, ItemBase.propTypes, Item.propTypes, LabeledItem.propTypes);
LabeledItem.defaultProps = Object.assign({}, ItemBase.defaultProps, Item.defaultProps, LabeledItem.defaultProps);

storiesOf('LabeledItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of LabeledItem',
		() => (
			<LabeledItem
				label={'Label'}
				disabled={boolean('disabled')}
			>
				Hello LabeledItem
			</LabeledItem>
		));
