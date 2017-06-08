import ExpandableInput, {ExpandableInputBase} from '@enact/moonstone/ExpandableInput';
import {icons} from '@enact/moonstone/Icon';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {boolean, select, text} from '@kadira/storybook-addon-knobs';

import {mergeComponentMetadata} from '../../src/utils/propTables';

const iconNames = ['', ...Object.keys(icons)];

const Config = mergeComponentMetadata('ExpandableInput', ExpandableInputBase, ExpandableInput);

storiesOf('ExpandableInput')
	.addWithInfo(
		' ',
		'Basic usage of ExpandableInput',
		() => (
			<ExpandableInput
				disabled={boolean('disabled', false)}
				iconAfter={select('iconAfter', iconNames)}
				iconBefore={select('iconBefore', iconNames)}
				noneText={text('noneText', 'nothing inputted')}
				onChange={action('onChange')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				title={text('title', 'title')}
				placeholder={text('placeholder')}
				type={text('type')}
			/>
		),
		{propTables: [Config]}
	);
