import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, text, boolean, number, select} from '@kadira/storybook-addon-knobs';

import Pickable from 'enact-ui/Pickable';
import Picker, {PickerBase} from 'enact-moonstone/Picker';
import Icon from 'enact-moonstone/Icon';
import Divider from 'enact-moonstone/Divider';

import css from '../common.less';

const pickerStories = storiesOf('Picker').addDecorator(withKnobs);

const StatefulPicker = Pickable(Picker);
StatefulPicker.displayName = 'Picker';
StatefulPicker.propTypes = Object.assign({}, PickerBase.propTypes, Picker.propTypes);
StatefulPicker.defaultProps = Object.assign({}, PickerBase.defaultProps, Picker.defaultProps);

// Set up some defaults for info and knobs
const prop = {
	orientation: {'horizontal': 'horizontal', 'vertical': 'vertical'},
	width: {'null': null, 'small': 'small', 'medium': 'medium', 'large': 'large'}
};

const airports = [
	'San Francisco Airport Terminal Gate 1',
	'Boston Airport Terminal Gate 2',
	'Tokyo Airport Terminal Gate 3',
	'נמל התעופה בן גוריון טרמינל הבינלאומי'
];
const foods = ['Potato', 'Carrot', 'Tomato', 'Celery', 'Peanut'];

pickerStories
	.addWithInfo(
		'basic',
		'In its initial form, using an array of data, with only defaultValue and width specified.',
		() => (
			<StatefulPicker
				onChange={action('onChange')}
				defaultValue={number('defaultValue', 2)}
				width={select('width', prop.width, 'large')}
			>
				{airports}
			</StatefulPicker>
		),
	)
	.addWithInfo(
		'with Array and full options',
		'Customizable Picker with most options adjustable.',
		() => (
			<StatefulPicker
				onChange={action('onChange')}
				defaultValue={number('defaultValue', 2)}
				width={select('width', prop.width, 'large')}
				orientation={select('orientation', prop.orientation, 'horizontal')}
				wrap={boolean('wrap')}
				joined={boolean('joined')}
				noAnimation={boolean('noAnimation')}
				disabled={boolean('disabled')}
				incrementIcon={text('incrementIcon')}
				decrementIcon={text('decrementIcon')}
			>
				{airports}
			</StatefulPicker>
		),
	)
	.addWithInfo(
		'with Component children',
		'We see Picker supports arbitrary components as children to pick from.',
		() => (
			<StatefulPicker
				onChange={action('onChange')}
				defaultValue={number('defaultValue', 2)}
				width={select('width', prop.width, 'medium')}
				orientation={select('orientation', prop.orientation, 'horizontal')}
				wrap={boolean('wrap')}
				joined={boolean('joined')}
				noAnimation={boolean('noAnimation')}
				disabled={boolean('disabled')}
				incrementIcon={text('incrementIcon')}
				decrementIcon={text('decrementIcon')}
			>
				<Icon>search</Icon>
				<Icon>gear</Icon>
				<Icon>trash</Icon>
			</StatefulPicker>
		),
	)
	.addWithInfo(
		'with custom icons',
		'Picker supports customized icons for the increment and decrement buttons in any orientation. Any valid Icon name or format is supported.',
		() => (
			<StatefulPicker
				onChange={action('onChange')}
				defaultValue={number('defaultValue', 2)}
				width={select('width', prop.width, 'medium')}
				orientation={select('orientation', prop.orientation, 'vertical')}
				wrap={boolean('wrap')}
				joined={boolean('joined')}
				noAnimation={boolean('noAnimation')}
				disabled={boolean('disabled')}
				incrementIcon={text('incrementIcon', 'plus')}
				decrementIcon={text('decrementIcon', 'minus')}
			>
				{foods}
			</StatefulPicker>
		),
	)
	.addWithInfo(
		'joined',
		'Picker may have both buttons joined together into a single shape, if that is more appropriate for your usage.',
		() => (
			<StatefulPicker
				onChange={action('onChange')}
				defaultValue={number('defaultValue', 2)}
				width={select('width', prop.width, 'medium')}
				orientation={select('orientation', prop.orientation, 'horizontal')}
				wrap={boolean('wrap', true)}
				joined={boolean('joined', true)}
				noAnimation={boolean('noAnimation')}
				disabled={boolean('disabled')}
				incrementIcon={text('incrementIcon')}
				decrementIcon={text('decrementIcon')}
			>
				{foods}
			</StatefulPicker>
		),
	)
	.addWithInfo(
		'at a glance',
		'Many variations of Picker all displaying together.',
		() => (
			<div>
				<section>
					<Divider>Horizontal</Divider>
					<div className={css.row}>
						<StatefulPicker defaultValue={2} width="large" wrap onChange={action('onChange')}>
							{airports}
						</StatefulPicker>
						<StatefulPicker defaultValue={1} joined width="small" onChange={action('onChange')}>
							<Icon className={css.pickerIcon}>search</Icon>
							<Icon className={css.pickerIcon}>gear</Icon>
							<Icon className={css.pickerIcon}>trash</Icon>
						</StatefulPicker>
					</div>
				</section>
				<section>
					<Divider>Vertical</Divider>
					<div className={css.row}>
						<StatefulPicker orientation="vertical" width="large" onChange={action('onChange')}>
							{airports}
						</StatefulPicker>
						<StatefulPicker orientation="vertical" incrementIcon="plus" decrementIcon="minus" width="large" onChange={action('onChange')}>
							{airports}
						</StatefulPicker>
						<StatefulPicker orientation="vertical" joined onChange={action('onChange')}>
							{foods}
						</StatefulPicker>
						<StatefulPicker orientation="vertical" joined width="small" onChange={action('onChange')}>
							<Icon className={css.pickerIcon}>search</Icon>
							<Icon className={css.pickerIcon}>gear</Icon>
							<Icon className={css.pickerIcon}>trash</Icon>
						</StatefulPicker>
					</div>
				</section>
			</div>
		),
		{propTables: [StatefulPicker]}
	)
;
