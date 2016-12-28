import Picker, {PickerBase} from '@enact/moonstone/Picker';
import Changeable from '@enact/ui/Changeable';
import {icons} from '@enact/moonstone/Icon';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select} from '@kadira/storybook-addon-knobs';

const StatefulPicker = Changeable(Picker);
StatefulPicker.propTypes = Object.assign({}, PickerBase.propTypes, StatefulPicker.propTypes);
StatefulPicker.defaultProps = Object.assign({}, PickerBase.defaultProps, StatefulPicker.defaultProps);
StatefulPicker.displayName = 'Picker';

const prop = {
	orientation: ['horizontal', 'vertical'],
	width: ['<null>', 'small', 'medium', 'large']
};
const nullify = (v) => v === '<null>' ? null : v;

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
	]
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
				reverse={boolean('reverse')}
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
				reverse={boolean('reverse')}
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
				reverse={boolean('reverse')}
			>
				{pickerList.vegetables}
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
				reverse={boolean('reverse')}
			>
				{pickerList.oneAirport}
			</StatefulPicker>
		)
	);
