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
					disabled={boolean('disabled-1', false)}
					iconAfter={select('iconAfter-1', iconNames)}
					iconBefore={select('iconBefore-1', iconNames)}
					noneText={text('noneText-1', 'nothing inputted')}
					onChange={action('onChange')}
					onClose={action('onClose')}
					onOpen={action('onOpen')}
					open={boolean('open-1', true)}
					title={text('title-1', 'title')}
					placeholder={text('placeholder-1', 'ExpandableInput 1')}
					type={text('type-1')}
				/>
				<ExpandableInput
					disabled={boolean('disabled-2', false)}
					iconAfter={select('iconAfter-2', iconNames)}
					iconBefore={select('iconBefore-2', iconNames)}
					noneText={text('noneText-2', 'nothing inputted')}
					onChange={action('onChange')}
					onClose={action('onClose')}
					onOpen={action('onOpen')}
					open={boolean('open-2', true)}
					title={text('title-2', 'title')}
					placeholder={text('placeholder-2', 'ExpandableInput 2')}
					type={text('type-2')}
				/>
			</div>
		)
	);
