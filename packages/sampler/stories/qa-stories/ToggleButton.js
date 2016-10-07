import ToggleButton, {ToggleButtonBase} from '@enact/moonstone/ToggleButton';
import Toggleable from '@enact/ui/Toggleable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, text, boolean, select} from '@kadira/storybook-addon-knobs';

const StatefulToggleButton = Toggleable(ToggleButton);
StatefulToggleButton.propTypes = Object.assign({}, ToggleButtonBase.propTypes, ToggleButton.propTypes);
StatefulToggleButton.defaultProps = Object.assign({}, ToggleButtonBase.defaultProps, ToggleButton.defaultProps);
StatefulToggleButton.displayName = 'ToggleButton';

// Set up some defaults for info and knobs
const prop = {
	backgroundOpacity: {'opaque': 'opaque', 'translucent': 'translucent', 'transparent': 'transparent'},
	tallText:{'ิ้  ไั  ஒ  து': 'ิ้  ไั  ஒ  து', 'ÁÉÍÓÚÑÜ': 'ÁÉÍÓÚÑÜ', 'Bản văn': 'Bản văn'}
};

storiesOf('ToggleButton')
	.addDecorator(withKnobs)
	.addWithInfo(
		'Long text',
		() => (
			<StatefulToggleButton
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
				disabled={boolean('disabled')}
				preserveCase={boolean('preserveCase')}
				small={boolean('small')}
				toggleOnLabel={text('toggleOnLabel', 'Loooooooooooooooooog On')}
				toggleOffLabel={text('toggleOffLabel', 'Loooooooooooooooooog Off')}
			/>
		)
	)
	.addWithInfo(
		'Tall Characters',
		() => (
			<StatefulToggleButton
				onClick={action('onClick')}
				backgroundOpacity={select('backgroundOpacity', prop.backgroundOpacity)}
				disabled={boolean('disabled')}
				preserveCase={boolean('preserveCase')}
				small={boolean('small')}
				toggleOnLabel={select('toggleOnLabel', prop.tallText, 'ิ้  ไั  ஒ  து')}
				toggleOffLabel={select('toggleOffLabel', prop.tallText, 'ิ้  ไั  ஒ  து')}
			/>
		)
	);


