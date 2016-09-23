import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

import {Toggleable} from 'enact-ui/Toggleable';
import {SwitchItemBase} from 'enact-moonstone/SwitchItem';

const SwitchItem = Toggleable({prop: 'checked'}, SwitchItemBase);
SwitchItem.displayName = 'SwitchItem';
SwitchItem.propTypes = Object.assign({}, SwitchItem.propTypes, SwitchItemBase.propTypes);
SwitchItem.defaultProps = Object.assign({}, SwitchItem.defaultProps, SwitchItemBase.defaultProps);

delete SwitchItem.propTypes.checked;
delete SwitchItem.propTypes.icon;
delete SwitchItem.propTypes.iconClasses;

storiesOf('SwitchItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		'',
		'Basic usage of SwitchItem',
		() => (
			<SwitchItem
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
				value={text('value', 'defaultValue')}
			>
				Hello SwitchItem
			</SwitchItem>
		));
