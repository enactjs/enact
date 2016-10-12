import ExpList from '@enact/moonstone/ExpandableList';
import Selectable from '@enact/ui/Selectable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, text} from '@kadira/storybook-addon-knobs';

const ExpandableList = Selectable(ExpList);
ExpandableList.propTypes = Object.assign({}, ExpList.propTypes);

storiesOf('ExpandableList')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of ExpandableList',
		() => (
			<ExpandableList
				onChange={action('onChange')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				title={text('title', 'title')}
				noneText={text('noneText', 'nothing selected')}
				disabled={boolean('disabled', false)}
			>
				{['option1', 'option2', 'option3']}
			</ExpandableList>
		)
	);
