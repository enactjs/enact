import ExpandableList, {ExpandableListBase} from '@enact/moonstone/ExpandableList';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('ExpandableList', ExpandableList, ExpandableListBase);
ExpandableList.displayName = 'ExpandableList';

storiesOf('Moonstone', module)
	.add(
		'ExpandableList',
		() => (
			<ExpandableList
				closeOnSelect={boolean('closeOnSelect', Config)}
				disabled={boolean('disabled', Config)}
				noAutoClose={boolean('noAutoClose', Config)}
				noLockBottom={boolean('noLockBottom', Config)}
				noneText={text('noneText', Config, 'nothing selected')}
				onSelect={action('onSelect')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				select={select('select', ['radio', 'multiple', 'single'], Config, 'radio')}
				title={text('title', Config, 'title')}
			>
				{['option1', 'option2', 'option3']}
			</ExpandableList>
		),
		{
			info: {
				text: 'Basic usage of ExpandableList'
			}
		}
	);
