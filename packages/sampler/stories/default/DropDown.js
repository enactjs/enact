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
					inline
					title="Dropdown 1"
					defaultSelected={3}
				>
					{['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5']}
				</DropDown>

				<DropDown
					inline
					title="Dropdown 2"
				>
					{['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5', 'Option 6']}
				</DropDown>
				<DropDown
					inline
					title="Dropdown 3"
				>
					{['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5']}
				</DropDown>
				{/* <DropDown
					closeOnSelect={boolean('closeOnSelect', Config)}
					direction={select('direction', ['up', 'down'], Config)}
					disabled={boolean('disabled', Config)}
					noAutoClose={boolean('noAutoClose', Config)}
					noneText={text('noneText', Config, 'nothing selected')}
					onSelect={action('onSelect')}
					onClose={action('onClose')}
					onOpen={action('onOpen')}
					selected={number}
					title={text('title', Config, 'title')}
				>
					{['option1', 'option2', 'option3']}
				</DropDown> */}
			</div>
		))
	);
