import Button, {ButtonBase} from '@enact/moonstone/Button';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

Button.propTypes = Object.assign({}, ButtonBase.propTypes, Button.propTypes);
Button.defaultProps = Object.assign({}, ButtonBase.defaultProps, Button.defaultProps);
Button.displayName = 'Button';

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: {'opaque': 'opaque', 'translucent': 'translucent', 'transparent': 'transparent'},
	longText:{'Loooooooooooooooooog Button': 'Loooooooooooooooooog Button', 'BUTTON   WITH   EXTRA   SPACES': 'BUTTON   WITH   EXTRA   SPACES'},
	tallText:{'ิ้  ไั  ஒ  து': 'ิ้  ไั  ஒ  து', 'ÁÉÍÓÚÑÜ': 'ÁÉÍÓÚÑÜ', 'Bản văn': 'Bản văn'}
},

style = {
	tapArea: {
		background: 'rgba(0, 100, 200, 0.2)',
		border: '1px solid rgba(0, 100, 200, 0.4)'
	}
};

storiesOf('Button')
	.addDecorator(withKnobs)
	.addWithInfo(
		'with long text',
		() => (
			<Button
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
				disabled={boolean('disabled')}
				minWidth={boolean('minWidth')}
				preserveCase={boolean('preserveCase')}
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
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
				disabled={boolean('disabled')}
				minWidth={boolean('minWidth')}
				preserveCase={boolean('preserveCase')}
				selected={boolean('selected')}
				small={boolean('small')}
			>
				{select('value', prop.tallText, 'ิ้  ไั  ஒ  து')}
			</Button>
		)
	)
	.addWithInfo(
		'with no minWidth',
		() => (
			<Button
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
				disabled={boolean('disabled')}
				minWidth={boolean('minWidth', false)}
				preserveCase={boolean('preserveCase')}
				selected={boolean('selected')}
				small={boolean('small')}
			>
				{text('value', 'A')}
			</Button>
		)
	)
	.addWithInfo(
		'with tap area displayed',
		() => (
			<Button
				style={style.tapArea}
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
				disabled={boolean('disabled')}
				minWidth={boolean('minWidth')}
				preserveCase={boolean('preserveCase')}
				selected={boolean('selected')}
				small={boolean('small')}
			>
				Button
			</Button>
		)
	)
	.addWithInfo(
		'to receive nearest neighbor spotlight',
		() => (
			<div>
				<Button
					onClick={action('onClick')}
					backgroundOpacity={'backgroundOpacity', 'translucent'}
					disabled={boolean('disabled')}
					minWidth={boolean('minWidth')}
					preserveCase={boolean('preserveCase')}
					selected={boolean('selected')}
					small={boolean('small')}
				>
					Button
				</Button>
				<Button
					onClick={action('onClick')}
					backgroundOpacity={'backgroundOpacity', 'transparent'}
					disabled={boolean('disabled')}
					minWidth={boolean('minWidth')}
					preserveCase={boolean('preserveCase')}
					selected={boolean('selected')}
					small={boolean('small')}
				>
					Button
				</Button>
			</div>
		)
	);

