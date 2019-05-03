import DropDown, {DropDownBase} from '@enact/moonstone/DropDown';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('DropDown', DropDown, DropDownBase);
DropDown.displayName = 'DropDown';



storiesOf('Moonstone', module)
	.add(
		'DropDown',
		withInfo({
			text: 'Basic usage of DropDown'
		})(() => (
			<div>
				<DropDown
					direction={select('direction', ['up', 'down'], Config)}
					disabled={boolean('disabled', Config)}
					onClose={action('onClose')}
					onOpen={action('onOpen')}
					onSelect={action('onSelect')}
					title={text('title', Config, 'Dropdown')}
				>
					{['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5']}
				</DropDown>
			</div>
		))
	);
