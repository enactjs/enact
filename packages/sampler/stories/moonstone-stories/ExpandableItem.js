import ExpandableItem from '@enact/moonstone/ExpandableItem';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';


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
				This can be any type of content you might want
				to render inside an labeled expandable container
			</ExpandableItem>
		)
	);
