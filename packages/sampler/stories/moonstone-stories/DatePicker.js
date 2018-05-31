import DatePicker from '@enact/moonstone/DatePicker';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';

DatePicker.displayName = 'DatePicker';

storiesOf('Moonstone', module)
	.add(
		'DatePicker',
		withInfo({
			propTablesExclude: [DatePicker],
			text: 'The basic DatePicker'
		})(() => (
			<DatePicker
				dayAriaLabel={nullify(text('dayAriaLabel', ''))}
				dayLabel={nullify(text('dayLabel', ''))}
				monthAriaLabel={nullify(text('monthAriaLabel', ''))}
				monthLabel={nullify(text('monthLabel', ''))}
				noLabels={nullify(boolean('noLabels', false))}
				noneText={text('noneText', 'Nothing Selected')}
				onChange={action('onChange')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				title={text('title', 'Date')}
				yearAriaLabel={nullify(text('yearAriaLabel', ''))}
				yearLabel={nullify(text('yearLabel', ''))}
			/>
		))
	);
