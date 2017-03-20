import Changeable from '@enact/ui/Changeable';
import ExpandablePicker from '@enact/moonstone/ExpandablePicker';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, select, text} from '@kadira/storybook-addon-knobs';

const ChangeableExpandablePicker = Changeable(ExpandablePicker);
ChangeableExpandablePicker.displayName = 'ExpandablePicker';

const emoticons = ['💥 boom', '😩🖐 facepalm', '🍩 doughnut', '👻 ghost', '💍 ring', '🎮 videogame', '🍌🍌 bananas'];

storiesOf('ExpandablePicker')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of ExpandablePicker',
		() => (
			<ChangeableExpandablePicker
				title={text('title', 'Favorite Emoji')}
				onChange={action('onChange')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				width={select('width', ['small', 'medium', 'large'], 'large')}
			>
				{emoticons}
			</ChangeableExpandablePicker>
		)
	);
