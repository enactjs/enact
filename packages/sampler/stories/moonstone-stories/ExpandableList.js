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
				disabled={boolean('disabled', false)}
				noneText={text('noneText', 'nothing selected')}
				onChange={action('onChange')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				open={boolean('open', false)}
				title={text('title', 'title')}
			>
				{['option1', 'option2', 'option3']}
			</ExpandableList>
		)
	);
