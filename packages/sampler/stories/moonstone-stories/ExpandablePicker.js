import ExpandablePicker from '@enact/moonstone/ExpandablePicker';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, select, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';

ExpandablePicker.displayName = 'ExpandablePicker';

const emoticons = ['💥 boom', '😩🖐 facepalm', '🍩 doughnut', '👻 ghost', '💍 ring', '🎮 videogame', '🍌🍌 bananas'];

storiesOf('Moonstone', module)
	.add(
		'ExpandablePicker',
		withInfo({
			propTablesExclude: [ExpandablePicker],
			text: 'Basic usage of ExpandablePicker'
		})(() => (
			<ExpandablePicker
				checkButtonAriaLabel={nullify(text('checkButtonAriaLabel', ''))}
				decrementAriaLabel={nullify(text('decrementAriaLabel', ''))}
				incrementAriaLabel={nullify(text('incrementAriaLabel', ''))}
				joined={boolean('joined', false)}
				onChange={action('onChange')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				pickerAriaLabel={nullify(text('pickerAriaLabel', ''))}
				title={text('title', 'Favorite Emoji')}
				width={select('width', ['small', 'medium', 'large'], 'large')}
			>
				{emoticons}
			</ExpandablePicker>
		))
	);
