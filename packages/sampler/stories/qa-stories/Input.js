import {kind, hoc} from '@enact/core';
import {icons} from '@enact/moonstone/Icon';
import Input, {InputBase} from '@enact/moonstone/Input';
import Button, {ButtonBase} from '@enact/moonstone/Button';
import Pickable from '@enact/ui/Pickable';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

// Adapter to use Pickable until a suitable state HOC is added to @enact/ui
const MakePickable = hoc((config, Wrapped) => {
	return kind({
		name: 'MakePickable',

		computed: {
			onChange: ({onChange}) => (ev) => {
				onChange({
					value: ev.target.value
				});
			}
		},

		render: (props) => (
			<Wrapped {...props} />
		)
	});
});

const StatefulInput = Pickable({mutable: true}, MakePickable(Input));

StatefulInput.propTypes = Object.assign({}, InputBase.propTypes, Input.propTypes);
StatefulInput.defaultProps = Object.assign({}, InputBase.defaultProps, Input.defaultProps);
StatefulInput.displayName = 'Input';

const iconNames = ['', ...Object.keys(icons)];

const inputData = {
	longText : 'Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Text',
	tallText : ['नरेंद्र मोदी',' ฟิ้  ไั  ஒ  து', 'ÃÑÕÂÊÎÔÛÄËÏÖÜŸ'],
	extraSpaceText : 'This		Text 		has			extra 		space',
	defaultNumber : 10,
	type: ['text','number','password'],
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
				placeholder={text('placeholder','Input some tall characters')}
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
				placeholder={text('placeholder','Number')}
				type={inputData.type[1]}
				min={text('min value', inputData.minValue)}
				max={text('max value', inputData.maxValue)}
				value={text('value', inputData.minValue)}
			/>
		)
	)
	.addWithInfo(
		'Multiple Components',
		() => (
			<div>
				<Button 
					onClick={action('onClick')}
				>
					QA Button
				</Button>
				<StatefulInput
					onChange={action('onChange')}
					disabled={boolean('disabled')}
					iconEnd={select('iconEnd', iconNames)}
					iconStart={select('iconStart', iconNames)}
					placeholder={text('placeholder')}
					type={select('type', inputData.type, inputData.type[0])}
					value={text('value', 'QA INPUT')}
				/>
				<br />
				<Button
					onClick={action('onClick')}
				>
					QA Button
				</Button>
				<StatefulInput
					onChange={action('onChange')}
					disabled={boolean('disabled')}
					iconEnd={select('iconEnd', iconNames)}
					iconStart={select('iconStart', iconNames)}
					placeholder={text('placeholder')}
					type={select('type', inputData.type, inputData.type[0])}
					value={text('value', 'QA INPUT')}
				/>
			</div>
		)
	);