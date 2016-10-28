import ExpandableItem from '@enact/moonstone/ExpandableItem';
import Icon from '@enact/moonstone/Icon';
import Item from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

ExpandableItem.displayName = 'ExpandableItem';

storiesOf('ExpandableItem')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of ExpandableItem',
		() => (
			<ExpandableItem
				disabled={boolean('disabled', false)}
				label={text('label', 'label')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				open={boolean('open', false)}
				showLabel={select('showLabel', ['always', 'never', 'auto'], 'auto')}
				title={text('title', 'title')}
			>
				<Item>
					This can be any type of content you might want to
					render inside an labeled expandable container
				</Item>
				<Item>
					<Icon>star</Icon> You could include other components as well <Icon>star</Icon>
				</Item>
			</ExpandableItem>
		)
	);
