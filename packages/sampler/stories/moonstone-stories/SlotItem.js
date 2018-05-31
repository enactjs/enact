import Icon from '@enact/moonstone/Icon';
import SlotItem from '@enact/moonstone/SlotItem';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {boolean, select, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';

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
				autoHide={nullify(select('autoHide', prop.autoHide, 'after'))}
				disabled={boolean('disabled', false)}
			>
				<Icon slot="slotBefore">star</Icon>
				{text('children', 'Hello Item')}
				<slotAfter>
					<Icon>lock</Icon>
					<Icon>flag</Icon>
				</slotAfter>
			</SlotItem>
		))
	);
