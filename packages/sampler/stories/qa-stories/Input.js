import {icons} from '@enact/moonstone/Icon';
import Input, {InputBase} from '@enact/moonstone/Input';
import Changeable from '@enact/ui/Changeable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, number, select, text} from '@kadira/storybook-addon-knobs';


const StatefulInput = Changeable({mutable: true}, Input);

StatefulInput.propTypes = Object.assign({}, InputBase.propTypes, Input.propTypes);
StatefulInput.defaultProps = Object.assign({}, InputBase.defaultProps, Input.defaultProps);
StatefulInput.displayName = 'Input';

const iconNames = ['', ...Object.keys(icons)];

const inputData = {
	longText : 'Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Text',
	tallText : ['नरेंद्र मोदी', ' ฟิ้  ไั  ஒ  து', 'ÃÑÕÂÊÎÔÛÄËÏÖÜŸ'],
	extraSpaceText : 'This		Text 		has			extra 		space',
	defaultNumber : 10,
	type: ['text', 'number', 'password'],
	minValue: 0,
	maxValue: 10
};


storiesOf('Input')
	.addDecorator(withKnobs)
	.addWithInfo(
		'Long Text',
		() => (
			<StatefulInput
				onChange={action('onChange')}
				disabled={boolean('disabled')}
				iconEnd={select('iconEnd', iconNames)}
				iconStart={select('iconStart', iconNames)}
				placeholder={text('placeholder')}
				type={select('type', inputData.type, inputData.type[0])}
				value={text('value', inputData.longText)}
			/>
		)
	)
	.addWithInfo(
		'Tall Characters',
		() => (
			<StatefulInput
				onChange={action('onChange')}
				disabled={boolean('disabled')}
				iconEnd={select('iconEnd', iconNames)}
				iconStart={select('iconStart', iconNames)}
				placeholder={text('placeholder', 'Input some tall characters')}
				type={select('type', inputData.type, inputData.type[0])}
				value={select('value', inputData.tallText,  inputData.tallText[2])}
			/>
		)
	)
	.addWithInfo(
		'Text with extra spaces',
		() => (
			<StatefulInput
				onChange={action('onChange')}
				disabled={boolean('disabled')}
				iconEnd={select('iconEnd', iconNames)}
				iconStart={select('iconStart', iconNames)}
				placeholder={text('placeholder')}
				type={select('type', inputData.type, inputData.type[0])}
				value={text('value', inputData.extraSpaceText)}
			/>
		)
	)
	.addWithInfo(
		'Input with range',
		() => (
			<StatefulInput
				onChange={action('onChange')}
				disabled={boolean('disabled')}
				iconEnd={select('iconEnd', iconNames)}
				iconStart={select('iconStart', iconNames)}
				type={inputData.type[1]}
				min={number('min value', inputData.minValue)}
				max={number('max value', inputData.maxValue)}
				value={number('value', inputData.minValue)}
			/>
		)
	);
