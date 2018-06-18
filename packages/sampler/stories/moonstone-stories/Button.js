import Button, {ButtonBase} from '@enact/moonstone/Button';
import UIButton, {ButtonBase as UIButtonBase} from '@enact/ui/Button';
import {icons} from '@enact/moonstone/Icon';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const Component = mergeComponentMetadata('Button', UIButtonBase, UIButton, ButtonBase, Button);

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: ['', 'translucent', 'lightTranslucent', 'transparent'],
	casing: ['', 'preserve', 'sentence', 'word', 'upper'],
	icons: ['', ...Object.keys(icons)]
};

storiesOf('Moonstone', module)
	.add(
		'Button',
		withInfo({
			propTables: false,
			text: 'The basic Button'
		})(() => (
			<Component
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity, Component)}
				casing={select('casing', prop.casing, Component)}
				disabled={boolean('disabled', Component)}
				icon={select('icon', prop.icons, Component)}
				minWidth={boolean('minWidth', Component)}
				selected={boolean('selected', Component)}
				small={boolean('small', Component)}
			>
				{text('children', Component, 'click me')}
			</Component>
		))
	);
