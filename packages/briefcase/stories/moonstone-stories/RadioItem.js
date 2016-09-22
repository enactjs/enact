import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

import {Toggleable} from 'enact-ui/Toggleable';
import {RadioItemBase} from 'enact-moonstone/RadioItem';

const RadioItem = Toggleable({prop: 'checked'}, RadioItemBase);
RadioItem.displayName = 'RadioItem';
RadioItem.propTypes = Object.assign({}, RadioItem.propTypes, RadioItemBase.propTypes);
RadioItem.defaultProps = Object.assign({}, RadioItem.defaultProps, RadioItemBase.defaultProps);

delete RadioItem.propTypes.checked;
delete RadioItem.propTypes.defaultChecked;
delete RadioItem.propTypes.icon;
delete RadioItem.propTypes.iconClasses;

storiesOf('RadioItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		'',
		'Basic usage of RadioItem',
		() => (
			<RadioItem
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
				value={text('value', 'defaultValue')}
			>
				Hello RadioItem
			</RadioItem>
		));
