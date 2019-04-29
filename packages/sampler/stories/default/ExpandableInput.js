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

// Set up some defaults for info and knobs
const prop = {
	type: ['text', 'number', 'password']
};

storiesOf('Moonstone', module)
	.add(
		'ExpandableInput',
		withInfo({
			text: 'Basic usage of ExpandableInput'
		})(() => (
			<ExpandableInput
				disabled={boolean('disabled', Config)}
				iconAfter={select('iconAfter', iconNames, Config)}
				iconBefore={select('iconBefore', iconNames, Config)}
				noneText={text('noneText', Config, 'noneText')}
				onChange={action('onChange')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				title={text('title', Config, 'title')}
				placeholder={text('placeholder', Config, 'placeholder')}
				type={select('type', prop.type, Config, prop.type[0])}
			/>
		))
	);
