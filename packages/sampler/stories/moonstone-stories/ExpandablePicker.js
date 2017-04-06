import ExpandablePicker, {ExpandablePickerBase} from '@enact/moonstone/ExpandablePicker';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, select, text} from '@kadira/storybook-addon-knobs';

import {mergeComponentMetadata, removeProps} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('ExpandablePicker', ExpandablePickerBase, ExpandablePicker);
removeProps(Config, 'onPick');

const emoticons = ['💥 boom', '😩🖐 facepalm', '🍩 doughnut', '👻 ghost', '💍 ring', '🎮 videogame', '🍌🍌 bananas'];

storiesOf('ExpandablePicker')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of ExpandablePicker',
		() => (
			<ExpandablePicker
				title={text('title', 'Favorite Emoji')}
				onChange={action('onChange')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				width={select('width', ['small', 'medium', 'large'], 'large')}
			>
				{emoticons}
			</ExpandablePicker>
		),
		{propTables: [Config]}
	);
