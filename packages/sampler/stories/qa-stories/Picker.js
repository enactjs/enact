import Picker from '@enact/moonstone/Picker';
import {icons} from '@enact/moonstone/Icon';
import PickerAddRemove from './components/PickerAddRemove';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {boolean, select} from '@kadira/storybook-addon-knobs';
import nullify from '../../src/utils/nullify.js';

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
	emptyList: []
};

storiesOf('Picker')
	.addWithInfo(
		'with long text',
		() => (
			<Picker
				onChange={action('onChange')}
				width={nullify(select('width', prop.width, 'large'))}
				orientation={select('orientation', prop.orientation, 'horizontal')}
				wrap={boolean('wrap')}
				joined={boolean('joined')}
				noAnimation={boolean('noAnimation')}
				disabled={boolean('disabled')}
				incrementIcon={select('incrementIcon', iconNames)}
				decrementIcon={select('decrementIcon', iconNames)}
			>
				{pickerList.long}
			</Picker>
		)
	)
	.addWithInfo(
		'with tall characters',
		() => (
			<Picker
				onChange={action('onChange')}
				width={nullify(select('width', prop.width, 'large'))}
				orientation={select('orientation', prop.orientation, 'horizontal')}
				wrap={boolean('wrap')}
				joined={boolean('joined')}
				noAnimation={boolean('noAnimation')}
				disabled={boolean('disabled')}
				incrementIcon={select('incrementIcon', iconNames)}
				decrementIcon={select('decrementIcon', iconNames)}
			>
				{pickerList.tall}
			</Picker>
		)
	)
	.addWithInfo(
		'with a default value',
		() => (
			<Picker
				onChange={action('onChange')}
				width={nullify(select('width', prop.width, 'medium'))}
				orientation={select('orientation', prop.orientation, 'horizontal')}
				wrap={boolean('wrap')}
				joined={boolean('joined')}
				noAnimation={boolean('noAnimation')}
				disabled={boolean('disabled')}
				incrementIcon={select('incrementIcon', iconNames)}
				decrementIcon={select('decrementIcon', iconNames)}
				defaultValue={2}
			>
				{pickerList.vegetables}
			</Picker>
		)
	)
	.addWithInfo(
		'with no items (PLAT-30963)',
		() => (
			<Picker
				onChange={action('onChange')}
				width={select('width', prop.width, 'large')}
				orientation={select('orientation', prop.orientation)}
				wrap={boolean('wrap', true)}
				joined={boolean('joined')}
				noAnimation={boolean('noAnimation')}
				disabled={boolean('disabled')}
				incrementIcon={select('incrementIcon', iconNames)}
				decrementIcon={select('decrementIcon', iconNames)}
			>
				{[]}
			</Picker>
		)
	)
	.addWithInfo(
		'with one item',
		() => (
			<Picker
				onChange={action('onChange')}
				width={nullify(select('width', prop.width, 'large'))}
				orientation={select('orientation', prop.orientation)}
				wrap={boolean('wrap', true)}
				joined={boolean('joined')}
				noAnimation={boolean('noAnimation')}
				disabled={boolean('disabled')}
				incrementIcon={select('incrementIcon', iconNames)}
				decrementIcon={select('decrementIcon', iconNames)}
			>
				{pickerList.oneAirport}
			</Picker>
		)
	)
	.addWithInfo(
		'with item add/remove (ENYO-2448)',
		() => (
			<PickerAddRemove
				width={select('width', prop.width, 'medium')}
				orientation={select('orientation', prop.orientation, 'horizontal')}
				wrap={boolean('wrap')}
				joined={boolean('joined')}
				noAnimation={boolean('noAnimation')}
				disabled={boolean('disabled')}
			>
				{pickerList.emptyList}
			</PickerAddRemove>
		)
	);
