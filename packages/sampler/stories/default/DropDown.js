import Dropdown, {DropdownBase} from '@enact/moonstone/Dropdown';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('Dropdown', Dropdown, DropdownBase);
Dropdown.displayName = 'Dropdown';



storiesOf('Moonstone', module)
	.add(
		'Dropdown',
		withInfo({
			text: 'Basic usage of Dropdown'
		})(() => (
			<div>
				<Dropdown
					direction={select('direction', ['up', 'down'], Config)}
					disabled={boolean('disabled', Config)}
					onClose={action('onClose')}
					onOpen={action('onOpen')}
					onSelect={action('onSelect')}
					title={text('title', Config, 'Dropdown')}
				>
					{['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5']}
				</Dropdown>
			</div>
		))
	);
