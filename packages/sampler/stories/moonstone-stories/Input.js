import Input from '@enact/moonstone/Input';
import icons from './icons';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, select, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';

const iconNames = ['', ...icons];

Input.displayName = 'Input';

storiesOf('Moonstone', module)
	.add(
		'Input',
		withInfo({
			propTablesExclude: [Input],
			text: 'The basic Input'
		})(() => (
			<Input
				onChange={action('onChange')}
				disabled={boolean('disabled', false)}
				dismissOnEnter={nullify(boolean('dismissOnEnter', false))}
				iconAfter={nullify(select('iconAfter', iconNames))}
				iconBefore={nullify(select('iconBefore', iconNames))}
				invalid={boolean('invalid', false)}
				invalidMessage={nullify(text('invalidMessage'))}
				placeholder={text('placeholder')}
				small={boolean('small', false)}
				type={text('type')}
			/>
		))
	);
