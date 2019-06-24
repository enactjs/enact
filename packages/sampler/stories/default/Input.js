import Input, {InputBase} from '@enact/moonstone/Input';
import icons from './icons';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const iconNames = ['', ...icons];

const Config = mergeComponentMetadata('Input', InputBase, Input);
Input.displayName = 'Input';

// Set up some defaults for info and knobs
const prop = {
	type: ['text', 'number', 'password']
};

storiesOf('Moonstone', module)
	.add(
		'Input',
		() => (
			<Input
				autoFocus={boolean('autoFocus', Config)}
				onChange={action('onChange')}
				disabled={boolean('disabled', Config)}
				dismissOnEnter={boolean('dismissOnEnter', Config)}
				iconAfter={select('iconAfter', iconNames, Config)}
				iconBefore={select('iconBefore', iconNames, Config)}
				invalid={boolean('invalid', Config)}
				invalidMessage={text('invalidMessage', Config)}
				placeholder={text('placeholder', Config)}
				size={select('size', ['small', 'large'], Config)}
				type={select('type', prop.type, Config, prop.type[0])}
			/>
		),
		{
			info: {
				text: 'The basic Input'
			}
		}
	);
