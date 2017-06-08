import ExpandableList, {ExpandableListBase} from '@enact/moonstone/ExpandableList';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {boolean, select, text} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';

storiesOf('ExpandableList')
	.addWithInfo(
		' ',
		'Basic usage of ExpandableList',
		() => (
			<ExpandableList
				closeOnSelect={nullify(boolean('closeOnSelect', false))}
				disabled={boolean('disabled', false)}
				noAutoClose={nullify(boolean('noAutoClose', false))}
				noLockBottom={nullify(boolean('noLockBottom', false))}
				noneText={text('noneText', 'nothing selected')}
				onSelect={action('onSelect')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				select={select('select', ['single', 'radio', 'multiple'], 'single')}
				title={text('title', 'title')}
			>
				{['option1', 'option2', 'option3']}
			</ExpandableList>
		),
		{propTables: [ExpandableListBase]}
	);
