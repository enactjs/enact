import Icon from '@enact/moonstone/Icon';
import Item, {ItemBase, ItemOverlay} from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {boolean, select, text} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('ItemOverlay', ItemBase, Item);

const prop = {
	autoHide: [null, 'after', 'before', 'both']
};

storiesOf('Item.ItemOverlay')
	.addWithInfo(
		'',
		'Basic usage of ItemOverlay',
		() => (
			<ItemOverlay
				autoHide={nullify(select('autoHide', prop.autoHide, 'after'))}
				disabled={boolean('disabled', false)}
			>
				<Icon slot="overlayBefore">star</Icon>
				{text('children', 'Hello Item')}
				<overlayAfter>
					<Icon>lock</Icon>
					<Icon>flag</Icon>
				</overlayAfter>
			</ItemOverlay>
		),
		{propTables: [Config]}
	);
