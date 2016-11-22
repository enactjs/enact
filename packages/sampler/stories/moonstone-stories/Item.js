import Icon from '@enact/moonstone/Icon';
import {Item, ItemOverlay} from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

Item.propTypes = Object.assign({}, Item.propTypes);
Item.defaultProps = Object.assign({}, Item.defaultProps);
Item.displayName = 'Item';

storiesOf('Item')
	.addDecorator(withKnobs)
	.addWithInfo(
		'Basic',
		'Basic usage of Item',
		() => (
			<Item
				disabled={boolean('disabled', false)}
			>
				{text('children', 'Hello Item')}
			</Item>
		))
	.addWithInfo(
		'ItemOverlay',
		`Basic usage of ItemOverlay --  a specialized version of Item that allows components to
		be wrapped with overlays that can be conditionally until spotted.`,
		() => (
			<ItemOverlay
				autoHide={select('autoHide', ['after', 'before', 'both', 'no'], 'no')}
			>
				<Icon slot="beforeOverlay">play</Icon>
				{text('children', 'Hello Item')}
				<Icon slot="afterOverlay">stop</Icon>
			</ItemOverlay>
		)
	);
