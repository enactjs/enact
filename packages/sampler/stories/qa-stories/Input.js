import {icons} from '@enact/moonstone/Icon';
import Input from '@enact/moonstone/Input';
import Changeable from '@enact/ui/Changeable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

const StatefulInput = Changeable(Input);

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
			<StatefulInput
				onChange={action('onChange')}
				disabled={boolean('disabled')}
				iconAfter={select('iconAfter', iconNames)}
				iconBefore={select('iconBefore', iconNames)}
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
				<StatefulInput
					onChange={action('onChange')}
					disabled={boolean('disabled')}
					iconAfter={select('iconAfter', iconNames)}
					iconBefore={select('iconBefore', iconNames)}
					noDecorator={boolean('noDecorator')}
					placeholder={text('placeholder', 'Input some tall characters')}
					type={select('type', inputData.type, inputData.type[0])}
					defaultValue={inputData.tallText[0]}
				/>
				<StatefulInput
					onChange={action('onChange')}
					disabled={boolean('disabled')}
					iconAfter={select('iconAfter', iconNames)}
					iconBefore={select('iconBefore', iconNames)}
					noDecorator={boolean('noDecorator')}
					placeholder={text('placeholder', 'Input some tall characters')}
					type={select('type', inputData.type, inputData.type[0])}
					defaultValue={inputData.tallText[1]}
				/>
				<StatefulInput
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
			<StatefulInput
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
					<StatefulInput
						onChange={action('onChange')}
						disabled={boolean('disabled')}
						iconAfter={select('iconAfter', iconNames)}
						iconBefore={select('iconBefore', iconNames)}
						noDecorator={boolean('noDecorator')}
						placeholder={text('placeholder')}
						type={select('type', inputData.type, inputData.type[0])}
						defaultValue={inputData.initialValue + ' one'}
					/>
					<StatefulInput
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
					<StatefulInput
						onChange={action('onChange')}
						disabled={boolean('disabled')}
						iconAfter={select('iconAfter', iconNames)}
						iconBefore={select('iconBefore', iconNames)}
						noDecorator={boolean('noDecorator')}
						placeholder={text('placeholder')}
						type={select('type', inputData.type, inputData.type[0])}
						defaultValue={inputData.initialValue + ' three'}
					/>
					<StatefulInput
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
			<StatefulInput
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
