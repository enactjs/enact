import DaySelector, {DaySelectorBase} from '@enact/moonstone/DaySelector';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {boolean} from '@kadira/storybook-addon-knobs';

import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('DaySelector', DaySelectorBase, DaySelector);

storiesOf('DaySelector')
	.addWithInfo(
		' ',
		'Basic usage of DaySelector',
		() => (
			<DaySelector
				disabled={boolean('disabled', false)}
				onSelect={action('onSelect')}
				useLongDayText={boolean('useLongDayText', false)}
			/>
		),
		{propTables: [Config]}
	);
