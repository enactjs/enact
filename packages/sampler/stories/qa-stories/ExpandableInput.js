import ExpandableInput from '@enact/moonstone/ExpandableInput';
import {icons} from '@enact/moonstone/Icon';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {boolean, select, text} from '@kadira/storybook-addon-knobs';

const iconNames = ['', ...Object.keys(icons)];

storiesOf('ExpandableInput')
	.addWithInfo(
		' ',
		'Long Placeholder',
		() => (
			<ExpandableInput
				disabled={boolean('disabled', false)}
				iconAfter={select('iconAfter', iconNames)}
				iconBefore={select('iconBefore', iconNames)}
				noneText={text('noneText', 'nothing inputted')}
				onChange={action('onChange')}
				onClose={action('onClose')}
				onOpen={action('onOpen')}
				open={boolean('open', true)}
				title={text('title', 'title')}
				placeholder={text('placeholder', 'Looooooooooooooooooooooong')}
				type={text('type')}
			/>
		)
	);
