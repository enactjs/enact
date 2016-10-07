import {SwitchItemBase} from '@enact/moonstone/SwitchItem';
import {Toggleable} from '@enact/ui/Toggleable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean} from '@kadira/storybook-addon-knobs';

const SwitchItem = Toggleable({prop: 'checked'}, SwitchItemBase);
SwitchItem.propTypes = Object.assign({}, SwitchItem.propTypes, SwitchItemBase.propTypes);
SwitchItem.defaultProps = Object.assign({}, SwitchItem.defaultProps, SwitchItemBase.defaultProps);
SwitchItem.displayName = 'SwitchItem';

delete SwitchItem.propTypes.checked;
delete SwitchItem.defaultProps.checked;

storiesOf('SwitchItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of SwitchItem',
		() => (
			<SwitchItem
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				Hello SwitchItem
			</SwitchItem>
		)
	);
