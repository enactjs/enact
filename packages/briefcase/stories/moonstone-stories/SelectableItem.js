import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

import {Toggleable} from 'enact-ui/Toggleable';
import {SelectableItemBase} from 'enact-moonstone/SelectableItem';

const SelectableItem = Toggleable({prop: 'checked'}, SelectableItemBase);
SelectableItem.displayName = 'SelectableItem';
SelectableItem.propTypes = SelectableItemBase.propTypes;
SelectableItem.defaultProps = SelectableItemBase.defaultProps;

storiesOf('SelectableItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		'',
		'Basic usage of SelectableItem',
		() => (
			<SelectableItem
				checked={boolean('checked', false)}
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
				value={text('value', 'defaultValue')}
			>
				Hello SelectableItem
			</SelectableItem>
		));
