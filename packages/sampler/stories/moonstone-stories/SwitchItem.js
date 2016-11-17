import {SwitchItem} from '@enact/moonstone/SwitchItem';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

SwitchItem.propTypes = Object.assign({}, SwitchItem.propTypes);
SwitchItem.defaultProps = Object.assign({}, SwitchItem.defaultProps);
SwitchItem.displayName = 'SwitchItem';

delete SwitchItem.propTypes.selected;
delete SwitchItem.defaultProps.selected;

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
				{text('children', 'Hello SwitchItem')}
			</SwitchItem>
		)
	);
