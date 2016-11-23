import Icon from '@enact/moonstone/Icon';
import {Item, ItemOverlay} from '@enact/moonstone/Item';
import OverlayDecorator from '@enact/moonstone/Item/OverlayDecorator';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

// Use the HOC to get a component from which to pluck the propTypes and defaultProps
const Overlay = OverlayDecorator('div');

ItemOverlay.propTypes = Object.assign({}, Item.propTypes, Overlay.propTypes);
ItemOverlay.defaultProps = Object.assign({}, Item.defaultProps, Overlay.defaultProps);
ItemOverlay.displayName = 'ItemOverlay';

storiesOf('Item')
	.addDecorator(withKnobs)
	.addWithInfo(
		'ItemOverlay',
		'Basic usage of ItemOverlay',
		() => (
			<ItemOverlay
				autoHide={select('autoHide', ['after', 'before', 'both', 'no'], 'no')}
				disabled={boolean('disabled', false)}
			>
				<overlayBefore>
					<Icon>star</Icon>
					<Icon>play</Icon>
				</overlayBefore>
				{text('children', 'Hello Item')}
				<Icon slot="overlayAfter">stop</Icon>
			</ItemOverlay>
		)
	);
