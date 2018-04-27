import ExpandablePicker, {ExpandablePickerBase} from '@enact/moonstone/ExpandablePicker';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, select, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import {mergeComponentMetadata, removeProps} from '../../src/utils/propTables';
import nullify from '../../src/utils/nullify.js';

const Config = mergeComponentMetadata('ExpandablePicker', ExpandablePickerBase, ExpandablePicker);
removeProps(Config, 'onPick');

const emoticons = ['💥 boom', '😩🖐 facepalm', '🍩 doughnut', '👻 ghost', '💍 ring', '🎮 videogame', '🍌🍌 bananas'];

storiesOf('Moonstone', module)
	.add(
		'ExpandablePicker',
		withInfo({
			propTables: [Config],
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
