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
				autoHide={select('autoHide', ['after', 'before', 'both', 'no'], 'after')}
				disabled={boolean('disabled', false)}
			>
				<Icon slot="overlayBefore">star</Icon>
				{text('children', 'Hello Item')}
				<overlayAfter>
					<Icon>lock</Icon>
					<Icon>flag</Icon>
				</overlayAfter>
			</ItemOverlay>
		)
	);
