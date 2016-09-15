import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import Pickable from 'enact-ui/Pickable';
import Picker, {PickerBase} from 'enact-moonstone/Picker';
import RangePicker from 'enact-moonstone/RangePicker';
import backgrounds from 'react-storybook-addon-backgrounds';
import {withKnobs, text, boolean, number} from '@kadira/storybook-addon-knobs';
import Moonstone from '../../src/MoonstoneEnvironment';

const StatefulRangePicker = Pickable(RangePicker);

const stories = storiesOf('Pickers');

stories.addDecorator(withKnobs);
stories.addDecorator(backgrounds([
	{name: 'dark', value: '#000000'}
]));

StatefulRangePicker.displayName = 'StatefulRangePicker';
StatefulRangePicker.propTypes = Object.assign({}, PickerBase.propTypes, Picker.propTypes );
StatefulRangePicker.defaultProps = Object.assign({}, PickerBase.defaultProps, Picker.defaultProps);

stories
	.addWithInfo(
		'StatefulRangePicker without wrap',
		'This is an example of using StatefulRangePicker without wrapping;',
		() => (
			<Moonstone title="StatefulRangePicker" description="This is an example of using StatefulRangePicker without wrapping.">
				<StatefulRangePicker
					onChange={action('changed')}
					min={number('min', 0)}
					max={number('max', 10)}
					value={number('value', 10)}
					width={text('width', 'small')}
				/>
			</Moonstone>
		)
	)
	.addWithInfo(
		'StatefulRangePicker with wrap',
		'This is an example of using StatefulRangePicker with wrapping;',
		() => (
			<Moonstone title="StatefulRangePicker with wrap" description="This is an example of using StatefulRangePicker with wrapping.">
				<StatefulRangePicker
					onChange={action('changed')}
					min={number('min', 0)}
					max={number('max', 10)}
					value={number('value', 10)}
					wrap={boolean('wrap', true)}
					width={text('width', 'small')}
				/>
			</Moonstone>
		)
	);
