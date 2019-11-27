import ExpandableInput, {ExpandableInputBase} from '@enact/moonstone/ExpandableInput';
import icons from './icons';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {boolean, select, text} from '../../src/enact-knobs';
import {action, mergeComponentMetadata} from '../../src/utils';

const iconNames = ['', ...icons];

const Config = mergeComponentMetadata('ExpandableInput', ExpandableInputBase, ExpandableInput);
ExpandableInput.displayName = 'ExpandableInput';

// Set up some defaults for info and knobs
const prop = {
	type: ['text', 'number', 'password']
};

storiesOf('Moonstone', module)
	.add(
		'ExpandableInput',
		() => (
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
		),
		{
			info: {
				text: 'Basic usage of ExpandableInput'
			}
		}
	);
