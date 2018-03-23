import ExpandableInput from '@enact/moonstone/ExpandableInput';
import {icons} from '@enact/moonstone/Icon';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, select, text} from '@storybook/addon-knobs';

const iconNames = ['', ...Object.keys(icons)];

storiesOf('ExpandableInput', module)
	.add(
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
	)
	.add(
		'Multiple ExpandableInputs',
		() => (
			<div>
				<ExpandableInput
					title="ExpandableInput 1"
					placeholder="ExpandableInput 1"
				/>
				<ExpandableInput
					title="ExpandableInput 2"
					placeholder="ExpandableInput 2"
				/>
			</div>
		)
	);
