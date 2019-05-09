import Dropdown, {DropdownBase} from '@enact/moonstone/Dropdown';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean, number, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

Dropdown.displayName = 'Dropdown';
const Config = mergeComponentMetadata('Dropdown', Dropdown, DropdownBase);

storiesOf('Moonstone', module)
	.add(
		'Dropdown',
		withInfo({
			text: 'A quick, inline, value-selection component'
		})(() => {
			const itemCount = number('items', Config, {range: true, min: 0, max: 8}, 5);
			const items = (new Array(itemCount)).fill().map((i, index) => `Option ${index + 1}`);

			return (
				<Dropdown
					direction={select('direction', ['up', 'down'], Config)}
					disabled={boolean('disabled', Config)}
					onClose={action('onClose')}
					onOpen={action('onOpen')}
					onSelect={action('onSelect')}
					title={text('title', Config, 'Dropdown')}
				>
					{items}
				</Dropdown>
			);
		})
	);
