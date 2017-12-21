import Divider from '@enact/moonstone/Divider';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {select, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

storiesOf('Divider', module)
	.add(
		' ',
		withInfo('Basic usage of divider')(() => (
			<Divider casing={select('casing', ['preserve', 'sentence', 'word', 'upper'], 'word')}>
				{text('children', 'divider text')}
			</Divider>
		))
	);
