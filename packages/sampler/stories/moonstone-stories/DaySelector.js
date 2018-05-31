import DaySelector from '@enact/moonstone/DaySelector';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, select} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

DaySelector.displayName = 'DaySelector';

storiesOf('Moonstone', module)
	.add(
		'DaySelector',
		withInfo({
			propTablesExclude: [DaySelector],
			text: 'Basic usage of DaySelector'
		})(() => (
			<DaySelector
				disabled={boolean('disabled', false)}
				dayNameLength={select('dayNameLength', ['short', 'medium', 'long', 'full'], 'long')}
				onSelect={action('onSelect')}
			/>
		))
	);
