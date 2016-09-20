import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, text, boolean, number, select} from '@kadira/storybook-addon-knobs';

import Pickable from 'enact-ui/Pickable';
import RangePicker, {RangePickerBase} from 'enact-moonstone/RangePicker';
import Divider from 'enact-moonstone/Divider';

import css from '../common.less';

const rangePickerStories = storiesOf('RangePicker').addDecorator(withKnobs);

const StatefulRangePicker = Pickable(RangePicker);
StatefulRangePicker.displayName = 'RangePicker';
StatefulRangePicker.propTypes = Object.assign({}, RangePickerBase.propTypes, RangePicker.propTypes);
StatefulRangePicker.defaultProps = Object.assign({}, RangePickerBase.defaultProps, RangePicker.defaultProps);

// Don't want to show `value` and it throws a warning, too!
delete StatefulRangePicker.propTypes.value;

// Set up some defaults for info and knobs
const prop = {
	orientation: {'horizontal': 'horizontal', 'vertical': 'vertical'},
	width: {'null': null, 'small': 'small', 'medium': 'medium', 'large': 'large'}
};

rangePickerStories
	.addWithInfo(
		'basic',
		'In its initial form, using an array of data, with the min, max, defaultValue and width specified.',
		() => (
			<StatefulRangePicker
				onChange={action('changed')}
				defaultValue={number('defaultValue', 10)}
				min={number('min', 0)}
				max={number('max', 10)}
				width={select('width', prop.width, 'small')}
			/>
		),
	)
	.addWithInfo(
		'joined',
		'Picker may have both buttons joined together into a single shape, if that is more appropriate for your usage.',
		() => (
			<StatefulRangePicker
				onChange={action('changed')}
				defaultValue={number('defaultValue', 10)}
				min={number('min', 0)}
				max={number('max', 10)}
				joined={boolean('joined', true)}
				width={select('width', prop.width, 'small')}
			/>
		),
	)
	.addWithInfo(
		'representing years',
		'Using a RangePicker to select a year within a given range of years.',
		() => (
			<StatefulRangePicker
				onChange={action('onChange')}
				defaultValue={number('defaultValue', 2016)}
				min={number('min', 1970)}
				max={number('max', 2050)}
				width={select('width', prop.width, 'small')}
				orientation={select('orientation', prop.orientation, 'vertical')}
				joined={boolean('joined', true)}
				incrementIcon={text('incrementIcon')}
				decrementIcon={text('decrementIcon')}
			/>
		),
	)
	.addWithInfo(
		'with step',
		'This RangePicker allows stepping the value up by a factor on each increment/decrement.',
		() => (
			<StatefulRangePicker
				onChange={action('onChange')}
				defaultValue={number('defaultValue', 0)}
				min={number('min', 0)}
				max={number('max', 100)}
				step={number('step', 5)}
				width={select('width', prop.width, 'medium')}
				orientation={select('orientation', prop.orientation, 'horizontal')}
				wrap={boolean('wrap')}
				joined={boolean('joined')}
				noAnimation={boolean('noAnimation')}
				disabled={boolean('disabled')}
				incrementIcon={text('incrementIcon', 'skipforward')}
				decrementIcon={text('decrementIcon', 'skipbackward')}
			/>
		),
	)
	.addWithInfo(
		'with custom icons',
		'Picker supports customized icons for the increment and decrement buttons in any orientation. Any valid Icon name or format is supported.',
		() => (
			<StatefulRangePicker
				onChange={action('onChange')}
				defaultValue={number('defaultValue', 2)}
				min={number('min', 0)}
				max={number('max', 10)}
				width={select('width', prop.width, 'medium')}
				orientation={select('orientation', prop.orientation, 'vertical')}
				wrap={boolean('wrap')}
				joined={boolean('joined')}
				noAnimation={boolean('noAnimation')}
				disabled={boolean('disabled')}
				incrementIcon={text('incrementIcon', 'plus')}
				decrementIcon={text('decrementIcon', 'minus')}
			/>
		),
	)
	.addWithInfo(
		'at a glance',
		'Many variations of RangePicker all displaying together.',
		() => (
			<div>
				<section>
					<Divider>Horizontal</Divider>
					<div className={css.row}>
						<StatefulRangePicker min={0} max={20} defaultValue={10} width="small" onChange={action('onChange')} />
						<StatefulRangePicker min={0} max={20} defaultValue={10} disabled onChange={action('onChange')} />
						<StatefulRangePicker min={0} max={18} defaultValue={9} step={3} joined wrap width="small" onChange={action('onChange')} />
					</div>
				</section>
				<section>
					<Divider>Vertical</Divider>
					<div className={css.row}>
						<StatefulRangePicker min={0} max={20} defaultValue={10} orientation="vertical" onChange={action('onChange')} />
						<StatefulRangePicker min={1970} max={2030} defaultValue={2016} orientation="vertical" width="small" incrementIcon="plus" decrementIcon="minus" joined onChange={action('onChange')} />
						<StatefulRangePicker min={1970} max={2030} defaultValue={2016} orientation="vertical" joined disabled onChange={action('onChange')} />
					</div>
				</section>
			</div>
		),
		{propTables: [StatefulRangePicker]}
	)
;
