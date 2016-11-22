import {RadioItemBase} from '@enact/moonstone/RadioItem';
import {Toggleable} from '@enact/ui/Toggleable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

const RadioItem = Toggleable({prop: 'selected'}, RadioItemBase);
RadioItem.displayName = 'RadioItem';
RadioItem.propTypes = Object.assign({}, RadioItem.propTypes, RadioItemBase.propTypes);
RadioItem.defaultProps = Object.assign({}, RadioItem.defaultProps, RadioItemBase.defaultProps);

delete RadioItem.propTypes.selected;
delete RadioItem.defaultProps.selected;

storiesOf('RadioItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of RadioItem',
		() => (
			<RadioItem
				disabled={boolean('disabled', false)}
				inline={boolean('inline', false)}
				onToggle={action('onToggle')}
			>
				{text('children', 'Hello RadioItem')}
			</RadioItem>
		)
	);
