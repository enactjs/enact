import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, boolean} from '@kadira/storybook-addon-knobs';

import LabeledItem from 'enact-moonstone/LabeledItem';
import Item, {ItemBase} from 'enact-moonstone/Item';

LabeledItem.propTypes = Object.assign({}, ItemBase.propTypes, Item.propTypes, LabeledItem.propTypes);
LabeledItem.defaultProps = Object.assign({}, ItemBase.defaultProps, Item.defaultProps, LabeledItem.defaultProps);

storiesOf('LabeledItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		'with label and text',
		'basic usage of LabeledItem',
		() => (
			<LabeledItem
				label={'Label'}
				disabled={boolean('disabled')}
				spotlightDisabled={boolean('spotlightDisabled')}
			>
				Hello LabeledItem
			</LabeledItem>
		));
