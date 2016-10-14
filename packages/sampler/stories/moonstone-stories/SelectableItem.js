import {SelectableItemBase} from '@enact/moonstone/SelectableItem';
import {Toggleable} from '@enact/ui/Toggleable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

const SelectableItem = Toggleable({prop: 'checked'}, SelectableItemBase);
SelectableItem.displayName = 'SelectableItem';
SelectableItem.propTypes = Object.assign({}, SelectableItem.propTypes, SelectableItemBase.propTypes);
SelectableItem.defaultProps = Object.assign({}, SelectableItem.defaultProps, SelectableItemBase.defaultProps);

delete SelectableItem.propTypes.checked;
delete SelectableItem.defaultProps.checked;

storiesOf('SelectableItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of SelectableItem',
		() => (
			<SelectableItem
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{text('children', 'Hello SelectableItem')}
			</SelectableItem>
		)
	);
