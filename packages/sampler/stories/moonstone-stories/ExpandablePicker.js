import ExpandablePicker, {ExpandablePickerBase} from '@enact/moonstone/ExpandablePicker';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {select, text} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import {mergeComponentMetadata, removeProps} from '../../src/utils/propTables';

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
				title={text('title', 'Favorite Emoji')}
				onChange={action('onChange')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				width={select('width', ['small', 'medium', 'large'], 'large')}
			>
				{emoticons}
			</ExpandablePicker>
		))
	);
