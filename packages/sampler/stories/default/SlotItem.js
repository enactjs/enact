import Icon from '@enact/moonstone/Icon';
import SlotItem from '@enact/moonstone/SlotItem';
import React from 'react';
import {storiesOf} from '@storybook/react';

import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('SlotItem', SlotItem);

const prop = {
	autoHide: [null, 'after', 'before', 'both']
};

SlotItem.displayName = 'SlotItem';

storiesOf('Moonstone', module)
	.add(
		'SlotItem',
		() => (
			<SlotItem
				autoHide={select('autoHide', prop.autoHide, Config, 'after')}
				disabled={boolean('disabled', Config)}
			>
				<Icon slot="slotBefore">star</Icon>
				{text('children', Config, 'Hello Item')}
				<slotAfter>
					<Icon>lock</Icon>
					<Icon>flag</Icon>
				</slotAfter>
			</SlotItem>
		),
		{
			info: {
				text: 'Basic usage of SlotItem'
			}
		}
	);
