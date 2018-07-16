import ExpandableList, {ExpandableListBase} from '@enact/moonstone/ExpandableList';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('ExpandableList', ExpandableList, ExpandableListBase);
ExpandableList.displayName = 'ExpandableList';

storiesOf('Moonstone', module)
	.add(
		'ExpandableList',
		withInfo({
			propTablesExclude: [ExpandableList],
			text: 'Basic usage of ExpandableList'
		})(() => (
			<ExpandableList
				closeOnSelect={boolean('closeOnSelect', Config, false)}
				disabled={boolean('disabled', Config, false)}
				noAutoClose={boolean('noAutoClose', Config, false)}
				noLockBottom={boolean('noLockBottom', Config, false)}
				noneText={text('noneText', Config, 'nothing selected')}
				onSelect={action('onSelect')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				select={select('select', ['radio', 'multiple', 'single'], Config, 'radio')}
				title={text('title', Config, 'title')}
			>
				{['option1', 'option2', 'option3']}
			</ExpandableList>
		))
	);
