import ToggleItemBase from '@enact/moonstone/ToggleItem';
import Toggleable from '@enact/ui/Toggleable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

import {icons} from '@enact/moonstone/Icon';
const iconNames = Object.keys(icons);

const ToggleItem = Toggleable({prop: 'selected'}, ToggleItemBase);
ToggleItem.propTypes = Object.assign({}, ToggleItem.propTypes, ToggleItemBase.propTypes);
ToggleItem.defaultProps = Object.assign({}, ToggleItem.defaultProps, ToggleItemBase.defaultProps);
ToggleItem.displayName = 'ToggleItem';

delete ToggleItem.propTypes.selected;
delete ToggleItem.defaultProps.selected;

storiesOf('ToggleItem')
	.addDecorator(withKnobs)
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
					{text('children', 'Toggle Item')}
				</ToggleItem>
			);
		}
	);
