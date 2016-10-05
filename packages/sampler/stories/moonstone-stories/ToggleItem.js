import {ToggleItemBase} from '@enact/moonstone/ToggleItem';
import Toggleable from '@enact/ui/Toggleable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select} from '@kadira/storybook-addon-knobs';

import {icons} from '@enact/moonstone/Icon';
const iconNames = Object.keys(icons);

const StatefulToggleItem = Toggleable({prop: 'checked'}, ToggleItemBase);
StatefulToggleItem.propTypes = Object.assign({}, ToggleItemBase.propTypes, Toggleable.propTypes);
StatefulToggleItem.defaultProps = Object.assign({}, ToggleItemBase.defaultProps, Toggleable.defaultProps);
StatefulToggleItem.displayName = 'StatefulToggleItem';

storiesOf('ToggleItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		'',
		'The basic ToggleItem',
		() => {
			return (
				<StatefulToggleItem
					icon={select('icon', iconNames, 'play')}
					disabled={boolean('disabled', false)}
					onToggle={action('onToggle')}
					inline={boolean('inline', false)}
				>
						Toggle Item
				</StatefulToggleItem>
		);}
	);
