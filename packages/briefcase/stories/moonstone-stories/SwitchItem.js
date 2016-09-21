import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

import {Toggleable} from 'enact-ui/Toggleable';
import {SwitchItemBase} from 'enact-moonstone/SwitchItem';

const SwitchItem = Toggleable({prop: 'checked'}, SwitchItemBase);
SwitchItem.displayName = 'SwitchItem';
SwitchItem.propTypes = SwitchItemBase.propTypes;
SwitchItem.defaultProps = SwitchItemBase.defaultProps;

storiesOf('SwitchItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		'',
		'Basic usage of SwitchItem',
		() => (
			<SwitchItem
				checked={boolean('checked', false)}
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
				value={text('value', 'defaultValue')}
			>
				Hello SwitchItem
			</SwitchItem>
		));
