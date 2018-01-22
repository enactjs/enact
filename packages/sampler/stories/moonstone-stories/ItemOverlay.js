import Icon from '@enact/moonstone/Icon';
import Item, {ItemBase, ItemOverlay} from '@enact/moonstone/Item';
import OverlayDecorator from '@enact/moonstone/Item/OverlayDecorator';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {boolean, select, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Overlay = OverlayDecorator('div');
const Config = mergeComponentMetadata('ItemOverlay', ItemBase, Item, Overlay);

const prop = {
	autoHide: [null, 'after', 'before', 'both']
};

storiesOf('Item.ItemOverlay', module)
	.add(
		' ',
		withInfo({
			propTables: [Config],
			text: 'Basic usage of ItemOverlay'
		})(() => (
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
		))
	);
