import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

import {Toggleable} from 'enact-ui/Toggleable';
import {RadioItemBase} from 'enact-moonstone/RadioItem';

const RadioItem = Toggleable({prop: 'checked'}, RadioItemBase);
RadioItem.displayName = 'RadioItem';
RadioItem.propTypes = RadioItemBase.propTypes;
RadioItem.defaultProps = RadioItemBase.defaultProps;

storiesOf('RadioItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		'',
		'Basic usage of RadioItem',
		() => (
			<RadioItem
				checked={boolean('checked', false)}
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
				value={text('value', 'defaultValue')}
			>
				Hello RadioItem
			</RadioItem>
		));
