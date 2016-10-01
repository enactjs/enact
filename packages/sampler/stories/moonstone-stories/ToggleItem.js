import {ToggleItemBase} from '@enact/moonstone/ToggleItem';
import Toggleable from '@enact/ui/Toggleable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, text, boolean, select} from '@kadira/storybook-addon-knobs';
import MockI18NAddon from '../../src/MockI18NAddon';

import {icons} from '@enact/moonstone/Icon';
const iconNames = Object.keys(icons);

const StatefulToggleButton = Toggleable({prop: 'checked'}, ToggleItemBase);
StatefulToggleButton.propTypes = Object.assign({}, ToggleItemBase.propTypes, Toggleable.propTypes);
StatefulToggleButton.defaultProps = Object.assign({}, ToggleItemBase.defaultProps, Toggleable.defaultProps);
StatefulToggleButton.displayName = 'StatefulToggleButton';

storiesOf('ToggleItem')
	.addDecorator(MockI18NAddon('en-US'))
	.addDecorator(withKnobs)
	.addWithInfo(
		'',
		'The basic ToggleItem',
		() => {
			return (
				<StatefulToggleButton
					icon={select('icon', iconNames, 'play')}
					defaultChecked={boolean('defaultChecked', true)}
					disabled={boolean('disabled', false)}
					onToggle={action('onToggle')}
					inline={boolean('inline', false)}
					iconClasses={text('iconClasses')}
					value={text('value', 'valueSent')}
				>
						Toggle Item
				</StatefulToggleButton>
		);}
	);
