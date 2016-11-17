import Button, {ButtonBase} from '@enact/moonstone/Button';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';
import css from './Button.less';

Button.propTypes = Object.assign({}, ButtonBase.propTypes, Button.propTypes);
Button.defaultProps = Object.assign({}, ButtonBase.defaultProps, Button.defaultProps);
Button.displayName = 'Button';

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: {'opaque': 'opaque', 'translucent': 'translucent', 'transparent': 'transparent'},
	longText:{'Loooooooooooooooooog Button': 'Loooooooooooooooooog Button', 'BUTTON   WITH   EXTRA   SPACES': 'BUTTON   WITH   EXTRA   SPACES'},
	tallText:{'ิ้  ไั  ஒ  து': 'ิ้  ไั  ஒ  து', 'ÁÉÍÓÚÑÜ': 'ÁÉÍÓÚÑÜ', 'Bản văn': 'Bản văn'}
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
		'to validate minWidth with a single character',
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
			<div>
				<Button
					className={css.tapArea}
					onClick={action('onClick')}
					backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
					disabled={boolean('disabled')}
					minWidth={boolean('minWidth')}
					preserveCase={boolean('preserveCase')}
					selected={boolean('selected')}
				>
					Normal Button
				</Button>
				<Button
					className={css.tapArea}
					onClick={action('onClick')}
					backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
					disabled={boolean('disabled')}
					minWidth={boolean('minWidth')}
					preserveCase={boolean('preserveCase')}
					selected={boolean('selected')}
					small
				>
					Small Button
				</Button>
			</div>
		)
	);

