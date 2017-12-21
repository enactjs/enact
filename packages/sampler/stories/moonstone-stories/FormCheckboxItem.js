import FormCheckboxItem from '@enact/moonstone/FormCheckboxItem';
import ToggleItem from '@enact/moonstone/ToggleItem';
import Item, {ItemBase} from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, select, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('FormCheckboxItem', ItemBase, Item, ToggleItem, FormCheckboxItem);

storiesOf('FormCheckboxItem', module)
	.add(
		' ',
		withInfo({
			propTables: [Config],
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
