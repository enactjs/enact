import ExpandableList from '@enact/moonstone/ExpandableList';
import Changeable from '@enact/ui/Changeable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

const List = Changeable({change: 'onSelect', prop: 'selected'}, ExpandableList);
List.displayName = 'ExpandableList';

storiesOf('ExpandableList')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of ExpandableList',
		() => (
			<List
				closeOnSelect={boolean('closeOnSelect', false)}
				disabled={boolean('disabled', false)}
				noAutoClose={boolean('noAutoClose', false)}
				noLockBottom={boolean('noLockBottom', false)}
				noneText={text('noneText', 'nothing selected')}
				onSelect={action('onSelect')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				select={select('select', ['single', 'radio', 'multiple'], 'single')}
				title={text('title', 'title')}
			>
				{['option1', 'option2', 'option3']}
			</List>
		)
	);
