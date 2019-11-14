import ExpandableInput from '@enact/moonstone/ExpandableInput';
import iconNames from '../default/icons';
import React from 'react';
import {storiesOf} from '@storybook/react';

import {boolean, select, text} from '../../src/enact-knobs';
import {action} from '../../src/utils';

ExpandableInput.displayName = 'ExpandableInput';

const sortedIconNames = ['', ...iconNames.sort()];

storiesOf('ExpandableInput', module)
	.add(
		'Long Placeholder',
		() => (
			<ExpandableInput
				disabled={boolean('disabled', ExpandableInput)}
				iconAfter={select('iconAfter', sortedIconNames,  ExpandableInput)}
				iconBefore={select('iconBefore', sortedIconNames,  ExpandableInput)}
				noneText={text('noneText', ExpandableInput, 'noneText')}
				onChange={action('onChange')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				open={boolean('open', ExpandableInput, true)}
				title={text('title', ExpandableInput, 'title')}
				placeholder={text('placeholder', ExpandableInput, 'Looooooooooooooooooooooong')}
				type={text('type', ExpandableInput, 'text')}
			/>
		)
	)
	.add(
		'Multiple ExpandableInputs',
		() => (
			<div>
				<ExpandableInput
					title="ExpandableInput 1"
					placeholder="ExpandableInput 1"
				/>
				<ExpandableInput
					title="ExpandableInput 2"
					placeholder="ExpandableInput 2"
				/>
			</div>
		)
	);
