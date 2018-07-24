import Icon from '@enact/moonstone/Icon';
import SlotItem from '@enact/moonstone/SlotItem';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {withInfo} from '@storybook/addon-info';

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
		withInfo({
			propTablesExclude: [Icon, SlotItem],
			text: 'Basic usage of SlotItem'
		})(() => (
			<SlotItem
				autoHide={select('autoHide', prop.autoHide, Config, 'after')}
				disabled={boolean('disabled', Config, false)}
			>
				<Icon slot="slotBefore">star</Icon>
				{text('children', Config, 'Hello Item')}
				<slotAfter>
					<Icon>lock</Icon>
					<Icon>flag</Icon>
				</slotAfter>
			</SlotItem>
		))
	);
