import ExpandableInput, {ExpandableInputBase} from '@enact/moonstone/ExpandableInput';
import {icons} from '@enact/moonstone/Icon';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const iconNames = ['', ...Object.keys(icons)];

const Config = mergeComponentMetadata('ExpandableInput', ExpandableInputBase, ExpandableInput);
ExpandableInput.displayName = 'ExpandableInput';

storiesOf('Moonstone', module)
	.add(
		'ExpandableInput',
		withInfo({
			propTablesExclude: [ExpandableInput],
			text: 'Basic usage of divider'
		})(() => (
			<ExpandableInput
				disabled={boolean('disabled', Config, false)}
				iconAfter={select('iconAfter', iconNames, Config)}
				iconBefore={select('iconBefore', iconNames, Config)}
				noneText={text('noneText', Config, 'noneText')}
				onChange={action('onChange')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				title={text('title', Config, 'title')}
				placeholder={text('placeholder', Config, 'placeholder')}
				type={text('type', Config, 'text')}
			/>
		))
	);
