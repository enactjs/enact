import Button, {ButtonBase} from '@enact/moonstone/Button';
import IconButton from '@enact/moonstone/IconButton';
import Heading from '@enact/moonstone/Heading';
import UIButton, {ButtonBase as UIButtonBase} from '@enact/ui/Button';
import React from 'react';
import {storiesOf} from '@storybook/react';

import {action, mergeComponentMetadata} from '../../src/utils';
import {boolean, select, text} from '../../src/enact-knobs';
import iconNames from '../default/icons';

import css from './Button.module.less';

// Button's prop `minWidth` defaults to true and we only want to show `minWidth={false}` in the JSX. In order to hide `minWidth` when `true`, we use the normal storybook boolean knob and return `void 0` when `true`.
Button.displayName = 'Button';
const Config = mergeComponentMetadata('Button', UIButtonBase, UIButton, ButtonBase, Button);

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: ['', 'translucent', 'lightTranslucent', 'transparent'],
	color: ['', 'red', 'green', 'yellow', 'blue'],
	longText: {'A Loooooooooooooooooog Button': 'A Loooooooooooooooooog Button', 'BUTTON   WITH   EXTRA   SPACES': 'BUTTON   WITH   EXTRA   SPACES'},
	tallText: {' ฟิ้ ไั  ஒ  து': ' ฟิ้ ไั  ஒ  து', 'ÁÉÍÓÚÑÜ': 'ÁÉÍÓÚÑÜ', 'Bản văn': 'Bản văn'},
	icons: ['', ...iconNames]
};

storiesOf('Button', module)
	.add(
		'with long text',
		() => (
			<Button
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity, Config)}
				disabled={boolean('disabled', Config)}
				icon={select('icon', prop.icons, Config)}
				minWidth={boolean('minWidth', Config, true) ? void 0 : false}
				selected={boolean('selected', Config)}
				size={select('size', ['small', 'large'], Config)}
			>
				{select('value', prop.longText, Config, 'A Loooooooooooooooooog Button')}
			</Button>
		)
	)
	.add(
		'with tall characters',
		() => (
			<Button
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity, Config)}
				disabled={boolean('disabled', Config)}
				icon={select('icon', prop.icons, Config)}
				minWidth={boolean('minWidth', Config, true) ? void 0 : false}
				selected={boolean('selected', Config)}
				size={select('size', ['small', 'large'], Config)}
			>
				{select('value', prop.tallText, Config, 'ฟิ้  ไั  ஒ  து')}
			</Button>
		)
	)
	.add(
		'to validate minWidth with a single character',
		() => (
			<Button
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity, Config)}
				disabled={boolean('disabled', Config)}
				icon={select('icon', prop.icons, Config)}
				minWidth={boolean('minWidth', Config, false) ? void 0 : false}
				selected={boolean('selected', Config)}
				size={select('size', ['small', 'large'], Config)}
			>
				{text('value', Config, 'A')}
			</Button>
		)
	)
	.add(
		'to test if the parent element\'s background causes occlusion',
		() => (
			<div className={css.bgColor}>
				<Button
					onClick={action('onClick')}
					backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity, Config)}
					disabled={boolean('disabled', Config)}
					icon={select('icon', prop.icons, Config)}
					minWidth={boolean('minWidth', Config, true) ? void 0 : false}
					selected={boolean('selected', Config)}
					size={select('size', ['small', 'large'], Config)}
				>
					Normal Button
				</Button>
			</div>
		)
	)
	.add(
		'with tap area displayed',
		() => (
			<div>
				<Heading>Button</Heading>
				<Button
					className={css.tapArea}
					onClick={action('onClick')}
					disabled={boolean('disabled', Config)}
					size="large"
				>
					Normal Button
				</Button>
				<Button
					className={css.tapArea}
					onClick={action('onClick')}
					disabled={boolean('disabled', Config)}
					size="small"
				>
					Small Button
				</Button>
				<Heading>IconButton</Heading>
				<IconButton
					className={css.tapArea}
					disabled={boolean('disabled', Config)}
					onClick={action('onClick')}
					size="large"
				>
					star
				</IconButton>
				<IconButton
					className={css.tapArea}
					disabled={boolean('disabled', Config)}
					onClick={action('onClick')}
					size="small"
				>
					star
				</IconButton>
			</div>
		)
	);
