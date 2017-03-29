import Input, {InputBase} from '@enact/moonstone/Input';
import icons from './icons';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('Input', InputBase, Input);

const iconNames = ['', ...icons];

storiesOf('Input')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'The basic Input',
		() => (
			<Input
				onChange={action('onChange')}
				disabled={boolean('disabled', false)}
				dismissOnEnter={nullify(boolean('dismissOnEnter', false))}
				iconAfter={nullify(select('iconAfter', iconNames))}
				iconBefore={nullify(select('iconBefore', iconNames))}
				placeholder={text('placeholder')}
				type={text('type')}
			/>
		),
		{propTables: [Config]}
	);
