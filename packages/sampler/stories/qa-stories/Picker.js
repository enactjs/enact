import Picker, {PickerBase} from '@enact/moonstone/Picker';
import Pickable from '@enact/ui/Pickable';
import {icons} from '@enact/moonstone/Icon';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, text, boolean, select} from '@kadira/storybook-addon-knobs';

const StatefulPicker = Pickable(Picker);

StatefulPicker.propTypes = Object.assign({}, PickerBase.propTypes, StatefulPicker.propTypes);
StatefulPicker.defaultProps = Object.assign({}, PickerBase.defaultProps, StatefulPicker.defaultProps);
StatefulPicker.displayName = 'Picker';

const prop = {
	'orientation': {'horizontal': 'horizontal', 'vertical': 'vertical'},
	'width': {'null': null, 'small': 'small', 'medium': 'medium', 'large': 'large'}
};

const iconNames = Object.keys(icons);

const pickerList = {
	airports: [
		'San Francisco Airport Terminal Gate 1',
		'Boston Airport Terminal Gate 2',
		'Tokyo Airport Terminal Gate 3',
		'נמל התעופה בן גוריון טרמינל הבינלאומי'
	],
	tall: [
		'नरेंद्र मोदी',
		' ฟิ้  ไั  ஒ  து',
		'ÃÑÕÂÊÎÔÛÄËÏÖÜŸ'
	],
	long: [
		'Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Text1',
		'Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Text2',
		'Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Text3',
		'Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Text4',
		'Looooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooong Text5'
	],
	vegetables: [
		'Celery',
		'Carrot',
		'Tomato',
		'Onion',
		'Broccoli',
		'Spinach'
	],
	countries: [
		'IND',
		'USA',
		'KOR',
		'CAN',
		'BEL',
		'AUS',
		'FRA',
		'HKG',
		'SGP'
	]
};

storiesOf('Picker')
	.addDecorator(withKnobs)
	.addWithInfo(
		'Horizontal',
		() => (
			<StatefulPicker
				onChange={action('onChange')}
				width={select('width', prop.width, 'large')}
				orientation={'horizontal'}
				wrap={boolean('wrap')}
				joined={boolean('joined')}
				noAnimation={boolean('noAnimation')}
				disabled={boolean('disabled')}
				incrementIcon={select('incrementIcon', iconNames, 'arrowlargeright')}
				decrementIcon={select('decrementIcon', iconNames, 'arrowlargeleft')}
			>
				{pickerList.airports}
			</StatefulPicker>
		)
	)

	.addWithInfo(
		'Vertical',
		() => (
			<StatefulPicker
				onChange={action('onChange')}
				width={select('width', prop.width, 'large')}
				orientation={'vertical'}
				wrap={boolean('wrap')}
				joined={boolean('joined')}
				noAnimation={boolean('noAnimation')}
				disabled={boolean('disabled')}
				incrementIcon={select('incrementIcon', iconNames, 'arrowlargeup')}
				decrementIcon={select('decrementIcon', iconNames, 'arrowlargedown')}
			>
				{pickerList.airports}
			</StatefulPicker>
		)
	)

	.addWithInfo(
		'Horizontal Tall',
		() => (
			<StatefulPicker
				onChange={action('onChange')}
				width={select('width', prop.width, 'large')}
				orientation={'horizontal'}
				wrap={boolean('wrap')}
				joined={boolean('joined')}
				noAnimation={boolean('noAnimation')}
				disabled={boolean('disabled')}
				incrementIcon={select('incrementIcon', iconNames, 'arrowlargeright')}
				decrementIcon={select('decrementIcon', iconNames, 'arrowlargeleft')}
			>
				{pickerList.tall}
			</StatefulPicker>
		)
	)

	.addWithInfo(
		'Vertical Tall',
		() => (
			<StatefulPicker
				onChange={action('onChange')}
				width={select('width', prop.width, 'large')}
				orientation={'vertical'}
				wrap={boolean('wrap')}
				joined={boolean('joined')}
				noAnimation={boolean('noAnimation')}
				disabled={boolean('disabled')}
				incrementIcon={select('incrementIcon', iconNames, 'arrowlargeup')}
				decrementIcon={select('decrementIcon', iconNames, 'arrowlargedown')}
			>
				{pickerList.tall}
			</StatefulPicker>
		)
	)

	.addWithInfo(
		'Horizontal Long',
		() => (
			<StatefulPicker
				onChange={action('onChange')}
				width='large'
				orientation={'horizontal'}
				wrap
				joined={boolean('joined')}
				noAnimation={boolean('noAnimation')}
				disabled={boolean('disabled')}
				incrementIcon={select('incrementIcon', iconNames, 'arrowlargeright')}
				decrementIcon={select('decrementIcon', iconNames, 'arrowlargeleft')}
			>
				{pickerList.long}
			</StatefulPicker>
		)
	)

	.addWithInfo(
		'Vertical Long',
		() => (
			<StatefulPicker
				onChange={action('onChange')}
				width='large'
				orientation={'vertical'}
				wrap
				joined={boolean('joined')}
				noAnimation={boolean('noAnimation')}
				disabled={boolean('disabled')}
				incrementIcon={select('incrementIcon', iconNames, 'arrowlargeup')}
				decrementIcon={select('decrementIcon', iconNames, 'arrowlargedown')}
			>
				{pickerList.long}
			</StatefulPicker>
		)
	)

	.addWithInfo(
		'Horizontal with defalut value',
		() => (
			<StatefulPicker
				onChange={action('onChange')}
				width='medium'
				orientation={'horizontal'}
				joined={boolean('joined')}
				noAnimation={boolean('noAnimation')}
				disabled={boolean('disabled')}
				incrementIcon={select('incrementIcon', iconNames, 'arrowlargeright')}
				decrementIcon={select('decrementIcon', iconNames, 'arrowlargeleft')}
				value={2}
			>
				{pickerList.vegetables}
			</StatefulPicker>
		)
	)

	.addWithInfo(
		'Vertical with defalut value',
		() => (
			<StatefulPicker
				onChange={action('onChange')}
				width='medium'
				orientation={'vertical'}
				joined={boolean('joined')}
				noAnimation={boolean('noAnimation')}
				disabled={boolean('disabled')}
				incrementIcon={select('incrementIcon', iconNames, 'arrowlargeup')}
				decrementIcon={select('decrementIcon', iconNames, 'arrowlargedown')}
				value={2}
			>
				{pickerList.vegetables}
			</StatefulPicker>
		)
	)

	.addWithInfo(
		'Horizontal with null defalut value',
		() => (
			<StatefulPicker
				onChange={action('onChange')}
				width='medium'
				orientation={'horizontal'}
				joined={boolean('joined')}
				noAnimation={boolean('noAnimation')}
				disabled={boolean('disabled')}
				incrementIcon={select('incrementIcon', iconNames, 'arrowlargeright')}
				decrementIcon={select('decrementIcon', iconNames, 'arrowlargeleft')}
				value=''
			>
				{pickerList.vegetables}
			</StatefulPicker>
		)
	)

	.addWithInfo(
		'Vertical with null defalut value',
		() => (
			<StatefulPicker
				onChange={action('onChange')}
				width='medium'
				orientation={'vertical'}
				joined={boolean('joined')}
				noAnimation={boolean('noAnimation')}
				disabled={boolean('disabled')}
				incrementIcon={text('incrementIcon')}
				decrementIcon={text('decrementIcon')}
				incrementIcon={select('incrementIcon', iconNames, 'arrowlargeup')}
				decrementIcon={select('decrementIcon', iconNames, 'arrowlargedown')}
				value=''
			>
				{pickerList.vegetables}
			</StatefulPicker>
		)
	)

	.addWithInfo(
		'Horizontal Multiple',
		() => (
			<div>
				<StatefulPicker
					onChange={action('onChange')}
					width={'small'}
					orientation={'horizontal'}
					wrap={boolean('wrap')}
					joined
					noAnimation={boolean('noAnimation')}
					disabled={boolean('disabled')}
					incrementIcon={select('incrementIcon', iconNames, 'arrowlargeright')}
					decrementIcon={select('decrementIcon', iconNames, 'arrowlargeleft')}
				>
					{pickerList.countries}
				</StatefulPicker>
				<StatefulPicker
					onChange={action('onChange')}
					width={'small'}
					orientation={'horizontal'}
					wrap={boolean('wrap')}
					joined
					noAnimation={boolean('noAnimation')}
					disabled={boolean('disabled')}
					incrementIcon={select('incrementIcon', iconNames, 'arrowlargeright')}
					decrementIcon={select('decrementIcon', iconNames, 'arrowlargeleft')}
				>
					{pickerList.countries}
				</StatefulPicker>
				<StatefulPicker
					onChange={action('onChange')}
					width={'small'}
					orientation={'horizontal'}
					wrap={boolean('wrap')}
					joined
					noAnimation={boolean('noAnimation')}
					disabled={boolean('disabled')}
					incrementIcon={select('incrementIcon', iconNames, 'arrowlargeright')}
					decrementIcon={select('decrementIcon', iconNames, 'arrowlargeleft')}
				>
					{pickerList.countries}
				</StatefulPicker>
			</div>
		)
	)

	.addWithInfo(
		'Vertical Multiple',
		() => (
			<div>
				<StatefulPicker
					onChange={action('onChange')}
					width={'small'}
					orientation={'vertical'}
					wrap={boolean('wrap')}
					joined
					noAnimation={boolean('noAnimation')}
					disabled={boolean('disabled')}
					incrementIcon={select('incrementIcon', iconNames, 'arrowlargeup')}
					decrementIcon={select('decrementIcon', iconNames, 'arrowlargedown')}
				>
					{pickerList.countries}
				</StatefulPicker>
				<StatefulPicker
					onChange={action('onChange')}
					width={'small'}
					orientation={'vertical'}
					wrap={boolean('wrap')}
					joined
					noAnimation={boolean('noAnimation')}
					disabled={boolean('disabled')}
					incrementIcon={select('incrementIcon', iconNames, 'arrowlargeup')}
					decrementIcon={select('decrementIcon', iconNames, 'arrowlargedown')}
				>
					{pickerList.countries}
				</StatefulPicker>
				<StatefulPicker
					onChange={action('onChange')}
					width={'small'}
					orientation={'vertical'}
					wrap={boolean('wrap')}
					joined
					noAnimation={boolean('noAnimation')}
					disabled={boolean('disabled')}
					incrementIcon={select('incrementIcon', iconNames, 'arrowlargeup')}
					decrementIcon={select('decrementIcon', iconNames, 'arrowlargedown')}
				>
					{pickerList.countries}
				</StatefulPicker>
			</div>
		)
	);