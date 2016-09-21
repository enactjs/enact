import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

import {Toggleable} from 'enact-ui/Toggleable';
import {CheckboxItemBase} from 'enact-moonstone/CheckboxItem';

const CheckboxItem = Toggleable({prop: 'checked'}, CheckboxItemBase);
CheckboxItem.displayName = 'CheckboxItem';
CheckboxItem.propTypes = CheckboxItemBase.propTypes;
CheckboxItem.defaultProps = CheckboxItemBase.defaultProps;

storiesOf('CheckboxItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		'',
		'Basic usage of CheckboxItem',
		() => (
			<CheckboxItem
				checked={boolean('checked', false)}
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
				value={text('value', 'defaultValue')}
			>
				Hello CheckboxItem
			</CheckboxItem>
		));
