import ExpandableList from '@enact/moonstone/ExpandableList';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, select, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';

ExpandableList.displayName = 'ExpandableList';

storiesOf('Moonstone', module)
	.add(
		'ExpandableList',
		withInfo({
			propTablesExclude: [ExpandableList],
			text: 'Basic usage of ExpandableList'
		})(() => (
			<ExpandableList
				closeOnSelect={nullify(boolean('closeOnSelect', false))}
				disabled={boolean('disabled', false)}
				noAutoClose={nullify(boolean('noAutoClose', false))}
				noLockBottom={nullify(boolean('noLockBottom', false))}
				noneText={text('noneText', 'nothing selected')}
				onSelect={action('onSelect')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				select={select('select', ['radio', 'multiple', 'single'], 'radio')}
				title={text('title', 'title')}
			>
				{['option1', 'option2', 'option3']}
			</ExpandableList>
		))
	);
