import Changeable from '@enact/ui/Changeable';
import DatePicker from '@enact/moonstone/DatePicker';
import Divider from '@enact/moonstone/Divider';
import ExpandablePicker from '@enact/moonstone/ExpandablePicker';
import Picker from '@enact/moonstone/Picker';
import RangePicker from '@enact/moonstone/RangePicker';
import TimePicker from '@enact/moonstone/TimePicker';
import React from 'react';
import {storiesOf} from '@kadira/storybook';

const StatefulPicker = Changeable(Picker);
const StatefulRangePicker = Changeable(RangePicker);
const ChangeableExpandablePicker = Changeable(ExpandablePicker);
const ChangeableDatePicker = Changeable(DatePicker);
const ChangeableTimePicker = Changeable(TimePicker);

const emoticons = ['💥 boom', '😩🖐 facepalm', '🍩 doughnut', '👻 ghost', '💍 ring', '🎮 videogame', '🍌🍌 bananas'];

const airports = [
	'San Francisco Airport Terminal Gate 1',
	'Boston Airport Terminal Gate 2',
	'Tokyo Airport Terminal Gate 3',
	'נמל התעופה בן גוריון טרמינל הבינלאומי'
];

storiesOf('Accessibility')
	.addWithInfo(
		'Pickers',
		'DatePicker, ExpandablePicker, Picker, RangePicker, TimePicker',
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
									joined
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
								joined
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
									joined
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
									joined
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
