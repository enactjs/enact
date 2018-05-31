import FormCheckboxItem from '@enact/moonstone/FormCheckboxItem';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, select, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

storiesOf('Moonstone', module)
	.add(
		'FormCheckboxItem',
		withInfo({
			propTablesExclude: [FormCheckboxItem],
			text: 'Basic usage of FormCheckboxItem'
		})(() => (
			<FormCheckboxItem
				disabled={boolean('disabled', false)}
				iconPosition={select('iconPosition', ['before', 'after'], 'before')}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{text('children', 'A Checkbox for a form')}
			</FormCheckboxItem>
		))
	);
