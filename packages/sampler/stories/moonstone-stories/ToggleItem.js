import {ToggleItemBase} from '@enact/moonstone/ToggleItem';
import Toggleable from '@enact/ui/Toggleable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {boolean, select} from '@kadira/storybook-addon-knobs';

import {icons} from '@enact/moonstone/Icon';
const iconNames = Object.keys(icons);

const ToggleItem = Toggleable({prop: 'checked'}, ToggleItemBase);
ToggleItem.propTypes = Object.assign({}, ToggleItemBase.propTypes, Toggleable.propTypes);
ToggleItem.defaultProps = Object.assign({}, ToggleItemBase.defaultProps, Toggleable.defaultProps);
ToggleItem.displayName = 'ToggleItem';

storiesOf('ToggleItem')
	.addWithInfo(
		' ',
		'The basic ToggleItem',
		() => {
			return (
				<ToggleItem
					icon={select('icon', iconNames, 'play')}
					disabled={boolean('disabled', false)}
					inline={boolean('inline', false)}
					onToggle={action('onToggle')}
				>
					Toggle Item
				</ToggleItem>
		);}
	);
