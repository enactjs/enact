import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, select, text} from '@enact/storybook-utils/addons/knobs';
import ExpandableList, {ExpandableListBase} from '@enact/moonstone/ExpandableList';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import React from 'react';
import {storiesOf} from '@storybook/react';

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
