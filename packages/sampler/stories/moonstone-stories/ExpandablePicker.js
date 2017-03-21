import Changeable from '@enact/ui/Changeable';
import {ExpandablePicker, ExpandablePickerBase} from '@enact/moonstone/ExpandablePicker';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, select, text} from '@kadira/storybook-addon-knobs';

const ChangeableExpandablePicker = Changeable(ExpandablePicker);
ChangeableExpandablePicker.displayName = 'Changeable(ExpandablePicker)';

const Config = {
	propTypes: Object.assign({}, ExpandablePicker.propTypes, ExpandablePickerBase.propTypes),
	defaultProps: Object.assign({}, ExpandablePicker.defaultProps, ExpandablePickerBase.defaultProps),
	displayName: 'ExpandablePicker'
};

'onPick'
	.split(' ')
	.forEach(prop => {
		delete Config.propTypes[prop];
		delete Config.defaultProps[prop];
	});

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
		),
		{propTables: [Config]}
	);
