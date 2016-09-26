import {CheckboxItemBase} from 'enact-moonstone/CheckboxItem';
import {Toggleable} from 'enact-ui/Toggleable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean} from '@kadira/storybook-addon-knobs';


const CheckboxItem = Toggleable({prop: 'checked'}, CheckboxItemBase);
CheckboxItem.displayName = 'CheckboxItem';
CheckboxItem.propTypes = Object.assign({}, CheckboxItem.propTypes, CheckboxItemBase.propTypes);
CheckboxItem.defaultProps = Object.assign({}, CheckboxItem.defaultProps, CheckboxItemBase.defaultProps);

delete CheckboxItem.propTypes.checked;
delete CheckboxItem.propTypes.icon;
delete CheckboxItem.propTypes.iconClasses;

storiesOf('CheckboxItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		'',
		'Basic usage of CheckboxItem',
		() => (
			<CheckboxItem
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				Hello CheckboxItem
			</CheckboxItem>
		));
