import {icons} from '@enact/moonstone/Icon';
import {Input, InputBase} from '@enact/moonstone/Input';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, select, text} from '@storybook/addon-knobs';

const iconNames = ['', ...Object.keys(icons)];

const divMargin = () => ({margin: '12px'});

const inputData = {
	longText : 'Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Text',
	longPlaceHolder : 'Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Placeholder',
	tallText : ['नरेंद्र मोदी', ' ฟิ้  ไั  ஒ  து', 'ÃÑÕÂÊÎÔÛÄËÏÖÜŸ'],
	extraSpaceText : 'This                                              Text                         has                           extra                                           space',
	initialNumericValue: 0,
	initialValue : 'Input field',
	rtlAndLtr: 'abcdeشلاؤيث',
	type: ['text', 'number', 'password']
};

storiesOf('Input', module)
	.add(
		'with long text',
		() => (
			<Input
				autoFocus={boolean('autoFocus')}
				onChange={action('onChange')}
				disabled={boolean('disabled')}
				iconAfter={select('iconAfter', iconNames)}
				iconBefore={select('iconBefore', iconNames)}
				invalid={boolean('invalid', false)}
				invalidMessage={text('invalidMessage', InputBase.defaultProps.invalidMessage)}
				noDecorator={boolean('noDecorator')}
				placeholder={text('placeholder')}
				type={select('type', inputData.type, inputData.type[0])}
				defaultValue={inputData.longText}
			/>
		)
	)
	.add(
		'with long placeholder',
		() => (
			<Input
				autoFocus={boolean('autoFocus')}
				onChange={action('onChange')}
				disabled={boolean('disabled')}
				iconAfter={select('iconAfter', iconNames)}
				iconBefore={select('iconBefore', iconNames)}
				invalid={boolean('invalid', false)}
				invalidMessage={text('invalidMessage', InputBase.defaultProps.invalidMessage)}
				noDecorator={boolean('noDecorator')}
				placeholder={text('placeholder', inputData.longPlaceHolder)}
				type={select('type', inputData.type, inputData.type[0])}
			/>
		)
	)
	.add(
		'with tall characters',
		() => (
			<div>
				<Input
					autoFocus={boolean('autoFocus')}
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
					autoFocus={boolean('autoFocus')}
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
					autoFocus={boolean('autoFocus')}
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
	.add(
		'with extra spacing',
		() => (
			<Input
				autoFocus={boolean('autoFocus')}
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
	.add(
		'with RTL and LTR text together',
		() => (
			<Input
				autoFocus={boolean('autoFocus')}
				onChange={action('onChange')}
				disabled={boolean('disabled')}
				iconAfter={select('iconAfter', iconNames)}
				iconBefore={select('iconBefore', iconNames)}
				noDecorator={boolean('noDecorator')}
				placeholder={text('placeholder', 'Input RTL and LTR text together')}
				type={select('type', inputData.type, inputData.type[0])}
				defaultValue={inputData.rtlAndLtr}
			/>
		)
	)
	.add(
		'5 way test',
		() => (
			<div>
				<div style={divMargin()}>
					<Input
						autoFocus={boolean('autoFocus')}
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
						autoFocus={boolean('autoFocus')}
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
				<div style={divMargin()}>
					<Input
						autoFocus={boolean('autoFocus')}
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
						autoFocus={boolean('autoFocus')}
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
	.add(
		'with a range',
		() => (
			<Input
				autoFocus={boolean('autoFocus')}
				onChange={action('onChange')}
				disabled={boolean('disabled')}
				iconAfter={select('iconAfter', iconNames)}
				iconBefore={select('iconBefore', iconNames)}
				noDecorator={boolean('noDecorator')}
				type={inputData.type[1]}
				defaultValue={inputData.initialNumericValue}
			/>
		)
	)
;
