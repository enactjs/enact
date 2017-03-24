import Picker from '@enact/moonstone/Picker';
import Changeable from '@enact/ui/Changeable';
import {icons} from '@enact/moonstone/Icon';
import PickerAddRemove from './components/PickerAddRemove';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select} from '@kadira/storybook-addon-knobs';
import nullify from '../../src/utils/nullify.js';

const StatefulPicker = Changeable(Picker);

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
	.addDecorator(withKnobs)
	.addWithInfo(
		'with long text',
		() => (
			<StatefulPicker
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
			</StatefulPicker>
		)
	)
	.addWithInfo(
		'with tall characters',
		() => (
			<StatefulPicker
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
			</StatefulPicker>
		)
	)
	.addWithInfo(
		'with a default value',
		() => (
			<StatefulPicker
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
			</StatefulPicker>
		)
	)
	.addWithInfo(
		'with no items (PLAT-30963)',
		() => (
			<StatefulPicker
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
			</StatefulPicker>
		)
	)
	.addWithInfo(
		'with one item',
		() => (
			<StatefulPicker
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
			</StatefulPicker>
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
