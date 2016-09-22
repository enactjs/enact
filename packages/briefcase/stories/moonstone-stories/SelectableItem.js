import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

import {Toggleable} from 'enact-ui/Toggleable';
import {SelectableItemBase} from 'enact-moonstone/SelectableItem';

const SelectableItem = Toggleable({prop: 'checked'}, SelectableItemBase);
SelectableItem.displayName = 'SelectableItem';
SelectableItem.propTypes = Object.assign({}, SelectableItem.propTypes, SelectableItemBase.propTypes);
SelectableItem.defaultProps = Object.assign({}, SelectableItem.defaultProps, SelectableItemBase.defaultProps);

delete SelectableItem.propTypes.checked;
delete SelectableItem.propTypes.defaultChecked;
delete SelectableItem.propTypes.icon;
delete SelectableItem.propTypes.iconClasses;

storiesOf('SelectableItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		'',
		'Basic usage of SelectableItem',
		() => (
			<SelectableItem
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
				value={text('value', 'defaultValue')}
			>
				Hello SelectableItem
			</SelectableItem>
		));
