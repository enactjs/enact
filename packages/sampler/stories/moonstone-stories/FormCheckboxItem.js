import FormCheckboxItem from '@enact/moonstone/FormCheckboxItem';
import ToggleItem from '@enact/moonstone/ToggleItem';
import Item, {ItemBase} from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('FormCheckboxItem', ItemBase, Item, ToggleItem, FormCheckboxItem);

storiesOf('FormCheckboxItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of FormCheckboxItem',
		() => (
			<FormCheckboxItem
				disabled={boolean('disabled', false)}
				iconPosition={select('iconPosition', ['before', 'after'], 'before')}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{text('children', 'A Checkbox for a form')}
			</FormCheckboxItem>
		),
		{propTables: [Config]}
	);
