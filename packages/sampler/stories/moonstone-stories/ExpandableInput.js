import ExpandableInput, {ExpandableInputBase} from '@enact/moonstone/ExpandableInput';
import {icons} from '@enact/moonstone/Icon';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, select, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import {mergeComponentMetadata} from '../../src/utils/propTables';

const iconNames = ['', ...Object.keys(icons)];

const Config = mergeComponentMetadata('ExpandableInput', ExpandableInputBase, ExpandableInput);

storiesOf('ExpandableInput', module)
	.add(
		' ',
		withInfo({
			propTables: [Config],
			text: 'Basic usage of divider'
		})(() => (
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
		))
	);
