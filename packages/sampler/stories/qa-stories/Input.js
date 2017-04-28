import {icons} from '@enact/moonstone/Icon';
import Input from '@enact/moonstone/Input';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

const iconNames = ['', ...Object.keys(icons)];

const inputData = {
	longText : 'Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Text',
	tallText : ['नरेंद्र मोदी', ' ฟิ้  ไั  ஒ  து', 'ÃÑÕÂÊÎÔÛÄËÏÖÜŸ'],
	extraSpaceText : 'This                                              Text                         has                           extra                                           space',
	initialNumericValue: 0,
	initialValue : 'Input field',
	type: ['text', 'number', 'password']
};

storiesOf('Input')
	.addDecorator(withKnobs)
	.addWithInfo(
		'with long text',
		() => (
			<Input
				onChange={action('onChange')}
				disabled={boolean('disabled')}
				iconAfter={select('iconAfter', iconNames)}
				iconBefore={select('iconBefore', iconNames)}
				invalid={boolean('invalid')}
				invalidMessage={text('invalidMessage')}
				noDecorator={boolean('noDecorator')}
				placeholder={text('placeholder')}
				type={select('type', inputData.type, inputData.type[0])}
				defaultValue={inputData.longText}
			/>
		)
	)
	.addWithInfo(
		'with tall characters',
		() => (
			<div>
				<Input
					onChange={action('onChange')}
					disabled={boolean('disabled')}
					iconAfter={select('iconAfter', iconNames)}
					iconBefore={select('iconBefore', iconNames)}
					noDecorator={boolean('noDecorator')}
					placeholder={text('placeholder', 'Input some tall characters')}
					type={select('type', inputData.type, inputData.type[0])}
					defaultValue={inputData.tallText[0]}
				/>
				<Input
					onChange={action('onChange')}
					disabled={boolean('disabled')}
					iconAfter={select('iconAfter', iconNames)}
					iconBefore={select('iconBefore', iconNames)}
					noDecorator={boolean('noDecorator')}
					placeholder={text('placeholder', 'Input some tall characters')}
					type={select('type', inputData.type, inputData.type[0])}
					defaultValue={inputData.tallText[1]}
				/>
				<Input
					onChange={action('onChange')}
					disabled={boolean('disabled')}
					iconAfter={select('iconAfter', iconNames)}
					iconBefore={select('iconBefore', iconNames)}
					noDecorator={boolean('noDecorator')}
					placeholder={text('placeholder', 'Input some tall characters')}
					type={select('type', inputData.type, inputData.type[0])}
					defaultValue={inputData.tallText[2]}
				/>
			</div>
		)
	)
	.addWithInfo(
		'with extra spacing',
		() => (
			<Input
				onChange={action('onChange')}
				disabled={boolean('disabled')}
				iconAfter={select('iconAfter', iconNames)}
				iconBefore={select('iconBefore', iconNames)}
				noDecorator={boolean('noDecorator')}
				placeholder={text('placeholder')}
				type={select('type', inputData.type, inputData.type[0])}
				defaultValue={inputData.extraSpaceText}
			/>
		)
	)
	.addWithInfo(
		'5 way test',
		() => (
			<div>
				<div>
					<Input
						onChange={action('onChange')}
						disabled={boolean('disabled')}
						iconAfter={select('iconAfter', iconNames)}
						iconBefore={select('iconBefore', iconNames)}
						noDecorator={boolean('noDecorator')}
						placeholder={text('placeholder')}
						type={select('type', inputData.type, inputData.type[0])}
						defaultValue={inputData.initialValue + ' one'}
					/>
					<Input
						onChange={action('onChange')}
						disabled={boolean('disabled')}
						iconAfter={select('iconAfter', iconNames)}
						iconBefore={select('iconBefore', iconNames)}
						noDecorator={boolean('noDecorator')}
						placeholder={text('placeholder')}
						type={select('type', inputData.type, inputData.type[0])}
						defaultValue={inputData.initialValue + ' two'}
					/>
				</div>
				<div>
					<Input
						onChange={action('onChange')}
						disabled={boolean('disabled')}
						iconAfter={select('iconAfter', iconNames)}
						iconBefore={select('iconBefore', iconNames)}
						noDecorator={boolean('noDecorator')}
						placeholder={text('placeholder')}
						type={select('type', inputData.type, inputData.type[0])}
						defaultValue={inputData.initialValue + ' three'}
					/>
					<Input
						onChange={action('onChange')}
						disabled={boolean('disabled')}
						iconAfter={select('iconAfter', iconNames)}
						iconBefore={select('iconBefore', iconNames)}
						noDecorator={boolean('noDecorator')}
						placeholder={text('placeholder')}
						type={select('type', inputData.type, inputData.type[0])}
						defaultValue={inputData.initialValue + ' four'}
					/>
				</div>
			</div>
		)
	)
	.addWithInfo(
		'with a range',
		() => (
			<Input
				onChange={action('onChange')}
				disabled={boolean('disabled')}
				iconAfter={select('iconAfter', iconNames)}
				iconBefore={select('iconBefore', iconNames)}
				noDecorator={boolean('noDecorator')}
				type={inputData.type[1]}
				defaultValue={inputData.initialNumericValue}
			/>
		)
	);
