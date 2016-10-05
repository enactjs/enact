import {RadioItemBase} from '@enact/moonstone/RadioItem';
import {Toggleable} from '@enact/ui/Toggleable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {boolean} from '@kadira/storybook-addon-knobs';

const RadioItem = Toggleable({prop: 'checked'}, RadioItemBase);
RadioItem.displayName = 'RadioItem';
RadioItem.propTypes = Object.assign({}, RadioItem.propTypes, RadioItemBase.propTypes);
RadioItem.defaultProps = Object.assign({}, RadioItem.defaultProps, RadioItemBase.defaultProps);

delete RadioItem.propTypes.checked;
delete RadioItem.propTypes.icon;
delete RadioItem.propTypes.iconClasses;

storiesOf('RadioItem')
	.addWithInfo(
		' ',
		'Basic usage of RadioItem',
		() => (
			<RadioItem
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				Hello RadioItem
			</RadioItem>
		)
	);
