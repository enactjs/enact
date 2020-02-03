import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, select, text} from '@enact/storybook-utils/addons/knobs';
import Input, {InputBase} from '@enact/moonstone/Input';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import React from 'react';
import {storiesOf} from '@storybook/react';

import icons from './icons';

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
