import Button from '@enact/moonstone/Button';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {boolean, select, text} from '@kadira/storybook-addon-knobs';
import css from './Button.less';

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: {'opaque': 'opaque', 'translucent': 'translucent', 'lightTranslucent': 'lightTranslucent', 'transparent': 'transparent'},
	longText:{'Loooooooooooooooooog Button': 'Loooooooooooooooooog Button', 'BUTTON   WITH   EXTRA   SPACES': 'BUTTON   WITH   EXTRA   SPACES'},
	tallText:{'ิ้  ไั  ஒ  து': 'ิ้  ไั  ஒ  து', 'ÁÉÍÓÚÑÜ': 'ÁÉÍÓÚÑÜ', 'Bản văn': 'Bản văn'}
};

storiesOf('Button')
	.addWithInfo(
		'with long text',
		() => (
			<Button
				casing={select('casing', ['preserve', 'sentence', 'word', 'upper'], 'upper')}
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
				disabled={boolean('disabled')}
				minWidth={boolean('minWidth')}
				selected={boolean('selected')}
				small={boolean('small')}
			>
				{select('value', prop.longText, 'Loooooooooooooooooog Button')}
			</Button>
		)
	)
	.addWithInfo(
		'with tall characters',
		() => (
			<Button
				casing={select('casing', ['preserve', 'sentence', 'word', 'upper'], 'upper')}
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
				disabled={boolean('disabled')}
				minWidth={boolean('minWidth')}
				selected={boolean('selected')}
				small={boolean('small')}
			>
				{select('value', prop.tallText, 'ิ้  ไั  ஒ  து')}
			</Button>
		)
	)
	.addWithInfo(
		'to validate minWidth with a single character',
		() => (
			<Button
				casing={select('casing', ['preserve', 'sentence', 'word', 'upper'], 'upper')}
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
				disabled={boolean('disabled')}
				minWidth={boolean('minWidth', false)}
				selected={boolean('selected')}
				small={boolean('small')}
			>
				{text('value', 'A')}
			</Button>
		)
	)
	.addWithInfo(
		'to test if the parent element\'s background causes occlusion',
		() => (
			<div className={css.bgColor}>
				<Button
					onClick={action('onClick')}
					disabled={boolean('disabled')}
				>
					Normal Button
				</Button>
			</div>
		)
	)
	.addWithInfo(
		'with tap area displayed',
		() => (
			<div>
				<Button
					casing={select('casing', ['preserve', 'sentence', 'word', 'upper'], 'upper')}
					className={css.tapArea}
					onClick={action('onClick')}
					backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
					disabled={boolean('disabled')}
					minWidth={boolean('minWidth')}
					selected={boolean('selected')}
				>
					Normal Button
				</Button>
				<Button
					casing={select('casing', ['preserve', 'sentence', 'word', 'upper'], 'upper')}
					className={css.tapArea}
					onClick={action('onClick')}
					backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
					disabled={boolean('disabled')}
					minWidth={boolean('minWidth')}
					selected={boolean('selected')}
					small
				>
					Small Button
				</Button>
			</div>
		)
	);

