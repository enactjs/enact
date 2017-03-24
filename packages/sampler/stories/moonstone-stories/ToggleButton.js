import ToggleButton, {ToggleButtonBase} from '@enact/moonstone/ToggleButton';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, text, boolean, select} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('ToggleButton', ToggleButtonBase, ToggleButton);

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: ['', 'translucent', 'transparent']
};

storiesOf('ToggleButton')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'The basic ToggleButton',
		() => (
			<ToggleButton
				aria-label="toggle button"
				onClick={action('onClick')}
				backgroundOpacity={nullify(select('backgroundOpacity', prop.backgroundOpacity))}
				disabled={boolean('disabled', false)}
				preserveCase={nullify(boolean('preserveCase', false))}
				small={nullify(boolean('small', false))}
				toggleOnLabel={text('toggleOnLabel', 'On')}
				toggleOffLabel={text('toggleOffLabel', 'Off')}
			>
				Missing Toggle Label
			</ToggleButton>
		),
		{propTables: [Config]}
	);
