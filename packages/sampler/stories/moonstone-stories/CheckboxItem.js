import {CheckboxItemBase} from '@enact/moonstone/CheckboxItem';
import {Toggleable} from '@enact/ui/Toggleable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

const CheckboxItem = Toggleable({prop: 'selected'}, CheckboxItemBase);
CheckboxItem.displayName = 'CheckboxItem';
CheckboxItem.propTypes = Object.assign({}, CheckboxItem.propTypes, CheckboxItemBase.propTypes);
CheckboxItem.defaultProps = Object.assign({}, CheckboxItem.defaultProps, CheckboxItemBase.defaultProps);

delete CheckboxItem.propTypes.selected;
delete CheckboxItem.defaultProps.selected;

storiesOf('CheckboxItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of CheckboxItem',
		() => (
			<CheckboxItem
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{text('children', 'Hello CheckboxItem')}
			</CheckboxItem>
		));
