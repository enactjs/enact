import Changeable from '@enact/ui/Changeable';
import {DatePicker, DatePickerBase} from '@enact/moonstone/DatePicker';
import {decrementIcons, incrementIcons} from './icons';
import Divider from '@enact/moonstone/Divider';
import ExpandablePicker from '@enact/moonstone/ExpandablePicker';
import Picker, {PickerBase} from '@enact/moonstone/Picker';
import RangePicker, {RangePickerBase} from '@enact/moonstone/RangePicker';
import {TimePicker, TimePickerBase} from '@enact/moonstone/TimePicker';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, number, select, text} from '@kadira/storybook-addon-knobs';

const StatefulPicker = Changeable(Picker);
StatefulPicker.propTypes = Object.assign({}, PickerBase.propTypes, StatefulPicker.propTypes);
StatefulPicker.defaultProps = Object.assign({}, PickerBase.defaultProps, StatefulPicker.defaultProps);
StatefulPicker.displayName = 'Picker';

const StatefulRangePicker = Changeable(RangePicker);
StatefulRangePicker.propTypes = Object.assign({}, RangePickerBase.propTypes, RangePicker.propTypes);
StatefulRangePicker.defaultProps = Object.assign({}, RangePickerBase.defaultProps, RangePicker.defaultProps);
StatefulRangePicker.displayName = 'RangePicker';
delete StatefulRangePicker.propTypes.value;

const emoticons = ['💥 boom', '😩🖐 facepalm', '🍩 doughnut', '👻 ghost', '💍 ring', '🎮 videogame', '🍌🍌 bananas'];
const ChangeableExpandablePicker = Changeable({value: 2}, ExpandablePicker);
ChangeableExpandablePicker.displayName = 'ExpandablePicker';

const ChangeableDatePicker = Changeable(DatePicker);
ChangeableDatePicker.propTypes = Object.assign({}, DatePicker.propTypes, DatePickerBase.propTypes, {
	onOpen: React.PropTypes.func,
	onClose: React.PropTypes.func,
	open: React.PropTypes.bool,
	value: React.PropTypes.instanceOf(Date)
});
ChangeableDatePicker.defaultProps = Object.assign({}, DatePicker.defaultProps, DatePickerBase.defaultProps);
ChangeableDatePicker.displayName = 'DatePicker';
'year defaultOpen day maxDays maxMonths month onChangeDate onChangeMonth onChangeYear order'
	.split(' ')
	.forEach(prop => {
		delete ChangeableDatePicker.propTypes[prop];
		delete ChangeableDatePicker.defaultProps[prop];
	});

const ChangeableTimePicker = Changeable(TimePicker);
ChangeableTimePicker.propTypes = Object.assign({}, TimePicker.propTypes, TimePickerBase.propTypes, {
	onOpen: React.PropTypes.func,
	onClose: React.PropTypes.func,
	open: React.PropTypes.bool,
	value: React.PropTypes.instanceOf(Date)
});
ChangeableTimePicker.defaultProps = Object.assign({}, TimePicker.defaultProps, TimePickerBase.defaultProps);
ChangeableTimePicker.displayName = 'TimePicker';
'onChangeHour defaultOpen onChangeMeridiem hour onChangeMinute minute meridiem meridiems order'
	.split(' ')
	.forEach(prop => {
		delete ChangeableTimePicker.propTypes[prop];
		delete ChangeableTimePicker.defaultProps[prop];
	});

const airports = [
	'San Francisco Airport Terminal Gate 1',
	'Boston Airport Terminal Gate 2',
	'Tokyo Airport Terminal Gate 3',
	'נמל התעופה בן גוריון טרמינל הבינלאומי'
];

storiesOf('Pickers')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of Picker',
		() => (
			<table>
				<thead>
					<tr>
						<th>Picker</th>
						<th>RangePicker</th>
						<th>ExpandablePicker, DatePicker and TimePicker</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<div><Divider>Picker</Divider></div>
							<div>
								<StatefulPicker
									decrementIcon=""
									disabled={false}
									incrementIcon=""
									joined={false}
									noAnimation={false}
									orientation="horizontal"
									width="small"
									wrap={false}
								>
									{airports}
								</StatefulPicker>
							</div>

							<div><Divider>Joined Picker</Divider></div>
							<div>
								<StatefulPicker
									decrementIcon=""
									disabled={false}
									incrementIcon=""
									joined={true}
									noAnimation={false}
									orientation="horizontal"
									width="small"
									wrap={false}
								>
									{airports}
								</StatefulPicker>
							</div>

							<div><Divider>Vertical Picker</Divider></div>
							<StatefulPicker
								decrementIcon=""
								disabled={false}
								incrementIcon=""
								joined={false}
								noAnimation={false}
								orientation="vertical"
								width="small"
								wrap={false}
							>
								{airports}
							</StatefulPicker>
							<StatefulPicker
								decrementIcon=""
								disabled={false}
								incrementIcon=""
								joined={true}
								noAnimation={false}
								orientation="vertical"
								width="small"
								wrap={false}
							>
								{airports}
							</StatefulPicker>
						</td>

						<td>
							<div><Divider>RangePicker</Divider></div>
							<div>
								<StatefulRangePicker
									decrementIcon=""
									defaultValue={0}
									disabled={false}
									incrementIcon=""
									joined={false}
									max={100}
									min={0}
									noAnimation={false}
									orientation="horizontal"
									step={5}
									width="small"
									wrap={false}
								/>
							</div>

							<div><Divider>Joined RangePicker</Divider></div>
							<div>
								<StatefulRangePicker
									decrementIcon=""
									defaultValue={0}
									disabled={false}
									incrementIcon=""
									joined={true}
									max={100}
									min={0}
									noAnimation={false}
									orientation="horizontal"
									step={5}
									width="small"
									wrap={false}
								/>
							</div>

							<div><Divider>Vertical RangePicker</Divider></div>
							<div>
								<StatefulRangePicker
									decrementIcon=""
									defaultValue={0}
									disabled={false}
									incrementIcon=""
									joined={false}
									max={100}
									min={0}
									noAnimation={false}
									orientation="vertical"
									step={5}
									width="small"
									wrap={false}
								/>
								<StatefulRangePicker
									decrementIcon=""
									defaultValue={0}
									disabled={false}
									incrementIcon=""
									joined={true}
									max={100}
									min={0}
									noAnimation={false}
									orientation="vertical"
									step={5}
									width="small"
									wrap={false}
								/>
							</div>
						</td>

						<td>
							<div><Divider>ExpandablePicker</Divider></div>
							<ChangeableExpandablePicker
								open={false}
								title="Favorite Emoji"
								width="large"
							>
								{emoticons}
							</ChangeableExpandablePicker>

							<div><Divider>DatePicker</Divider></div>
							<ChangeableDatePicker
								noLabels={false}
								noneText="Nothing Selected"
								title="Date"
							/>

							<div><Divider>TimePicker</Divider></div>
							<ChangeableTimePicker
								noLabels={false}
								noneText="Nothing Selected"
								title="Time"
							/>
						</td>
					</tr>
				</tbody>
			</table>
		)
	);
