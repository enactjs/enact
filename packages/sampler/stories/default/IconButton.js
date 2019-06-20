import IconButton, {IconButtonBase} from '@enact/moonstone/IconButton';
import Button, {ButtonBase} from '@enact/moonstone/Button';
import UIButton, {ButtonBase as UIButtonBase} from '@enact/ui/Button';
import icons from './icons';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

// import icons
import docs from '../../images/icon-enact-docs.png';
import factory from '../../images/icon-enact-factory.svg';
import logo from '../../images/icon-enact-logo.svg';

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: ['', 'translucent', 'lightTranslucent', 'transparent']
};

IconButton.displayName = 'IconButton';
const Config = mergeComponentMetadata('IconButton', Button, ButtonBase, UIButton, UIButtonBase, IconButtonBase, IconButton);

storiesOf('Moonstone', module)
	.add(
		'IconButton',
		() => {
			const iconType = select('icon type', ['glyph', 'url src', 'custom'], Config, 'glyph');
			let children;
			switch (iconType) {
				case 'glyph': children = select('icon', icons, Config, 'plus'); break;
				case 'url src': children = select('src', [docs, factory, logo], Config, logo); break;
				default: children = text('custom icon', Config);
			}
			return (
				<IconButton
					onClick={action('onClick')}
					backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity, Config, '')}
					color={select('color', ['', 'red', 'green', 'yellow', 'blue'], Config, '')}
					disabled={boolean('disabled', Config)}
					selected={boolean('selected', Config)}
					size={select('size', ['small', 'large'], Config)}
					tooltipText={text('tooltipText', Config, '')}
				>
					{children}
				</IconButton>
			)
		},
		{
			info: {
				text: 'The basic IconButton'
			}
		}
	);
