import ExpandableList from '@enact/moonstone/ExpandableList';
import Selectable from '@enact/ui/Selectable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

const List = Selectable(ExpandableList);
List.displayName = 'ExpandableList';

storiesOf('ExpandableList')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of ExpandableList',
		() => (
			<List
				disabled={boolean('disabled', false)}
				noneText={text('noneText', 'nothing selected')}
				onChange={action('onChange')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				open={boolean('open', false)}
				select={select('select', ['none', 'single', 'radio', 'multiple'], 'none')}
				title={text('title', 'title')}
			>
				{['option1', 'option2', 'option3']}
			</List>
		)
	);
