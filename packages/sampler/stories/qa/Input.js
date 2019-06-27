import {icons} from '@enact/moonstone/Icon';
import {Input, InputBase} from '@enact/moonstone/Input';
import ri from '@enact/ui/resolution';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, select, text} from '../../src/enact-knobs';

Input.displayName = 'Input';

const iconNames = ['', ...Object.keys(icons)];

const divMargin = () => ({margin: ri.unit(12, 'rem')});

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
				autoFocus={boolean('autoFocus', Input)}
				onChange={action('onChange')}
				disabled={boolean('disabled', Input)}
				iconAfter={select('iconAfter', iconNames, Input)}
				iconBefore={select('iconBefore', iconNames, Input)}
				invalid={boolean('invalid', Input, false)}
				invalidMessage={text('invalidMessage', Input, InputBase.defaultProps.invalidMessage)}
				placeholder={text('placeholder', Input)}
				size={select('size', ['small', 'large'], Input)}
				type={select('type', inputData.type, Input, inputData.type[0])}
				defaultValue={inputData.longText}
			/>
		)
	)
	.add(
		'with long placeholder',
		() => (
			<Input
				autoFocus={boolean('autoFocus', Input)}
				onChange={action('onChange')}
				disabled={boolean('disabled', Input)}
				iconAfter={select('iconAfter', iconNames, Input)}
				iconBefore={select('iconBefore', iconNames, Input)}
				invalid={boolean('invalid', Input, false)}
				invalidMessage={text('invalidMessage', Input, InputBase.defaultProps.invalidMessage)}
				placeholder={text('placeholder', Input, inputData.longPlaceHolder)}
				type={select('type', inputData.type, Input, inputData.type[0])}
				size={select('size', ['small', 'large'], Input)}
			/>
		)
	)
	.add(
		'with tall characters',
		() => (
			<div>
				<Input
					autoFocus={boolean('autoFocus', Input)}
					onChange={action('onChange')}
					disabled={boolean('disabled', Input)}
					iconAfter={select('iconAfter', iconNames, Input)}
					iconBefore={select('iconBefore', iconNames, Input)}
					placeholder={text('placeholder', Input, 'Input some tall characters')}
					type={select('type', inputData.type, Input, inputData.type[0])}
					size={select('size', ['small', 'large'], Input)}
					defaultValue={inputData.tallText[0]}
				/>
				<Input
					autoFocus={boolean('autoFocus', Input)}
					onChange={action('onChange')}
					disabled={boolean('disabled', Input)}
					iconAfter={select('iconAfter', iconNames, Input)}
					iconBefore={select('iconBefore', iconNames, Input)}
					placeholder={text('placeholder', Input, 'Input some tall characters')}
					type={select('type', inputData.type, Input, inputData.type[0])}
					size={select('size', ['small', 'large'], Input)}
					defaultValue={inputData.tallText[1]}
				/>
				<Input
					autoFocus={boolean('autoFocus', Input)}
					onChange={action('onChange')}
					disabled={boolean('disabled', Input)}
					iconAfter={select('iconAfter', iconNames, Input)}
					iconBefore={select('iconBefore', iconNames, Input)}
					placeholder={text('placeholder', Input, 'Input some tall characters')}
					type={select('type', inputData.type, Input, inputData.type[0])}
					size={select('size', ['small', 'large'], Input)}
					defaultValue={inputData.tallText[2]}
				/>
			</div>
		)
	)
	.add(
		'with extra spacing',
		() => (
			<Input
				autoFocus={boolean('autoFocus', Input)}
				onChange={action('onChange')}
				disabled={boolean('disabled', Input)}
				iconAfter={select('iconAfter', iconNames, Input)}
				iconBefore={select('iconBefore', iconNames, Input)}
				placeholder={text('placeholder', Input)}
				type={select('type', inputData.type, Input, inputData.type[0])}
				size={select('size', ['small', 'large'], Input)}
				defaultValue={inputData.extraSpaceText}
			/>
		)
	)
	.add(
		'with RTL and LTR text together',
		() => (
			<Input
				autoFocus={boolean('autoFocus', Input)}
				onChange={action('onChange')}
				disabled={boolean('disabled', Input)}
				iconAfter={select('iconAfter', iconNames, Input)}
				iconBefore={select('iconBefore', iconNames, Input)}
				placeholder={text('placeholder', Input, 'Input RTL and LTR text together')}
				type={select('type', inputData.type, Input, inputData.type[0])}
				size={select('size', ['small', 'large'], Input)}
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
						autoFocus={boolean('autoFocus', Input)}
						onChange={action('onChange')}
						disabled={boolean('disabled', Input)}
						iconAfter={select('iconAfter', iconNames, Input)}
						iconBefore={select('iconBefore', iconNames, Input)}
						placeholder={text('placeholder', Input)}
						type={select('type', inputData.type, Input, inputData.type[0])}
						size={select('size', ['small', 'large'], Input)}
						defaultValue={inputData.initialValue + ' one'}
					/>
					<Input
						autoFocus={boolean('autoFocus', Input)}
						onChange={action('onChange')}
						disabled={boolean('disabled', Input)}
						iconAfter={select('iconAfter', iconNames, Input)}
						iconBefore={select('iconBefore', iconNames, Input)}
						placeholder={text('placeholder', Input)}
						type={select('type', inputData.type, Input, inputData.type[0])}
						size={select('size', ['small', 'large'], Input)}
						defaultValue={inputData.initialValue + ' two'}
					/>
				</div>
				<div style={divMargin()}>
					<Input
						autoFocus={boolean('autoFocus', Input)}
						onChange={action('onChange')}
						disabled={boolean('disabled', Input)}
						iconAfter={select('iconAfter', iconNames, Input)}
						iconBefore={select('iconBefore', iconNames, Input)}
						placeholder={text('placeholder', Input)}
						type={select('type', inputData.type, Input, inputData.type[0])}
						size={select('size', ['small', 'large'], Input)}
						defaultValue={inputData.initialValue + ' three'}
					/>
					<Input
						autoFocus={boolean('autoFocus', Input)}
						onChange={action('onChange')}
						disabled={boolean('disabled', Input)}
						iconAfter={select('iconAfter', iconNames, Input)}
						iconBefore={select('iconBefore', iconNames, Input)}
						placeholder={text('placeholder', Input)}
						type={select('type', inputData.type, Input, inputData.type[0])}
						size={select('size', ['small', 'large'], Input)}
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
				autoFocus={boolean('autoFocus', Input)}
				onChange={action('onChange')}
				disabled={boolean('disabled', Input)}
				iconAfter={select('iconAfter', iconNames, Input)}
				iconBefore={select('iconBefore', iconNames, Input)}
				type={inputData.type[1]}
				size={select('size', ['small', 'large'], Input)}
				defaultValue={inputData.initialNumericValue}
			/>
		)
	)
;
