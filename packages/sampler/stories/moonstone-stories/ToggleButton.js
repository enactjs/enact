import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, text, boolean, select} from '@kadira/storybook-addon-knobs';

import Toggleable from 'enact-ui/Toggleable';
import ToggleButton, {ToggleButtonBase} from 'enact-moonstone/ToggleButton';

const buttonStories = storiesOf('ToggleButton').addDecorator(withKnobs);

const StatefulToggleButton = Toggleable(ToggleButton);

StatefulToggleButton.propTypes = Object.assign({}, ToggleButtonBase.propTypes, ToggleButton.propTypes);
StatefulToggleButton.defaultProps = Object.assign({}, ToggleButtonBase.defaultProps, ToggleButton.defaultProps);
StatefulToggleButton.displayName = 'ToggleButton';

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: {'opaque': 'opaque', 'translucent': 'translucent', 'transparent': 'transparent'}
};

buttonStories
	.addWithInfo(
		'',
		'The basic ToggleButton.',
		() => (
			<StatefulToggleButton
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
				disabled={boolean('disabled')}
				preserveCase={boolean('preserveCase')}
				small={boolean('small')}
				toggleOnLabel={text('toggleOnLabel', 'On')}
				toggleOffLabel={text('toggleOffLabel', 'Off')}
			/>
		)
	);
