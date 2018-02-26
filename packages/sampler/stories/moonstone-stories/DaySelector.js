import DaySelector, {DaySelectorBase} from '@enact/moonstone/DaySelector';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('DaySelector', DaySelectorBase, DaySelector);

storiesOf('Moonstone', module)
	.add(
		'DaySelector',
		withInfo({
			propTables: [Config],
			text: 'Basic usage of DaySelector'
		})(() => (
			<DaySelector
				disabled={boolean('disabled', false)}
				longDayLabels={boolean('longDayLabels', false)}
				onSelect={action('onSelect')}
			/>
		))
	);
