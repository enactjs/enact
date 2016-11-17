import ToggleItem from '@enact/moonstone/ToggleItem';
import Item, {ItemBase} from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

import {icons} from '@enact/moonstone/Icon';
const iconNames = Object.keys(icons);

ToggleItem.propTypes = Object.assign({}, ItemBase.propTypes, Item.propTypes, ToggleItem.propTypes);
ToggleItem.defaultProps = Object.assign({}, ItemBase.defaultProps, Item.defaultProps, ToggleItem.defaultProps);
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
					beginningIcon={select('beginningIcon', iconNames, 'play')}
					endingIcon={select('endingIcon', iconNames, 'trash')}
					autoHide={select('autoHide', ['no', 'beginning', 'ending', 'both'], 'no')}
					disabled={boolean('disabled', false)}
					inline={boolean('inline', false)}
					onToggle={action('onToggle')}
				>
					{text('children', 'Toggle Item')}
				</ToggleItem>
			);
		}
	);
