import Picker from '@enact/moonstone/Picker';
import {icons} from '@enact/moonstone/Icon';
import PickerAddRemove from './components/PickerAddRemove';
import PickerRTL from './components/PickerRTL';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';

import {boolean, select} from '../../src/enact-knobs';

Picker.displayName = 'Picker';

const prop = {
	orientation: ['horizontal', 'vertical'],
	width: [null, 'small', 'medium', 'large']
};

const iconNames = Object.keys(icons);

const pickerList = {
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
	oneAirport: [
		'San Francisco Airport Terminal Gate 1'
	],
	emptyList: [],
	orderedList: [
		'A',
		'B',
		'C',
		'D',
		'E',
		'F'
	]
};

storiesOf('Picker', module)
	.add(
		'with long text',
		() => (
			<Picker
				onChange={action('onChange')}
				width={select('width', prop.width, Picker, 'large')}
				orientation={select('orientation', prop.orientation, Picker, 'horizontal')}
				wrap={boolean('wrap', Picker, false)}
				joined={boolean('joined', Picker, false)}
				noAnimation={boolean('noAnimation', Picker, false)}
				disabled={boolean('disabled', Picker, false)}
				incrementIcon={select('incrementIcon', iconNames, Picker)}
				decrementIcon={select('decrementIcon', iconNames, Picker)}
			>
				{pickerList.long}
			</Picker>
		)
	)
	.add(
		'with tall characters',
		() => (
			<Picker
				onChange={action('onChange')}
				width={select('width', prop.width, Picker, 'large')}
				orientation={select('orientation', prop.orientation, Picker, 'horizontal')}
				wrap={boolean('wrap', Picker, false)}
				joined={boolean('joined', Picker, false)}
				noAnimation={boolean('noAnimation', Picker, false)}
				disabled={boolean('disabled', Picker, false)}
				incrementIcon={select('incrementIcon', iconNames, Picker)}
				decrementIcon={select('decrementIcon', iconNames, Picker)}
			>
				{pickerList.tall}
			</Picker>
		)
	)
	.add(
		'with a default value',
		() => (
			<Picker
				onChange={action('onChange')}
				width={select('width', prop.width, Picker, 'medium')}
				orientation={select('orientation', prop.orientation, Picker, 'horizontal')}
				wrap={boolean('wrap', Picker, false)}
				joined={boolean('joined', Picker, false)}
				noAnimation={boolean('noAnimation', Picker, false)}
				disabled={boolean('disabled', Picker, false)}
				incrementIcon={select('incrementIcon', iconNames, Picker)}
				decrementIcon={select('decrementIcon', iconNames, Picker)}
				defaultValue={2}
			>
				{pickerList.vegetables}
			</Picker>
		)
	)
	.add(
		'with no items (PLAT-30963)',
		() => (
			<Picker
				onChange={action('onChange')}
				width={select('width', prop.width, Picker, 'large')}
				orientation={select('orientation', prop.orientation, Picker)}
				wrap={boolean('wrap', Picker, true)}
				joined={boolean('joined', Picker, false)}
				noAnimation={boolean('noAnimation', Picker, false)}
				disabled={boolean('disabled', Picker, false)}
				incrementIcon={select('incrementIcon', iconNames, Picker)}
				decrementIcon={select('decrementIcon', iconNames, Picker)}
			>
				{[]}
			</Picker>
		)
	)
	.add(
		'with one item',
		() => (
			<Picker
				onChange={action('onChange')}
				width={select('width', prop.width, Picker, 'large')}
				orientation={select('orientation', prop.orientation, Picker)}
				wrap={boolean('wrap', Picker, true)}
				joined={boolean('joined', Picker, false)}
				noAnimation={boolean('noAnimation', Picker, false)}
				disabled={boolean('disabled', Picker, false)}
				incrementIcon={select('incrementIcon', iconNames, Picker)}
				decrementIcon={select('decrementIcon', iconNames, Picker)}
			>
				{pickerList.oneAirport}
			</Picker>
		)
	)
	.add(
		'with item add/remove (ENYO-2448)',
		() => (
			<PickerAddRemove
				width={select('width', prop.width, Picker, 'medium')}
				orientation={select('orientation', prop.orientation, Picker, 'horizontal')}
				wrap={boolean('wrap', Picker, false)}
				joined={boolean('joined', Picker, false)}
				noAnimation={boolean('noAnimation', Picker, false)}
				disabled={boolean('disabled', Picker, false)}
			>
				{pickerList.emptyList}
			</PickerAddRemove>
		)
	)
	.add(
		'RTL Layout (PLAT-28123)',
		() => (
			<PickerRTL
				width={select('width', prop.width, Picker, 'medium')}
				wrap={boolean('wrap', Picker, false)}
				joined={boolean('joined', Picker, false)}
				noAnimation={boolean('noAnimation', Picker, false)}
				disabled={boolean('disabled', Picker, false)}
			>
				{pickerList.orderedList}
			</PickerRTL>
		)
	);
