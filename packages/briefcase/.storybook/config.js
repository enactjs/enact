import {configure, setAddon, addDecorator} from '@kadira/storybook';
import infoAddon from '@kadira/react-storybook-addon-info';
import backgrounds from 'react-storybook-addon-backgrounds';
import Moonstone from '../src/MoonstoneEnvironment';

addDecorator(Moonstone);
addDecorator(backgrounds([
	{name: 'black', value: '#000000'},
	{name: 'dark image', value: 'darkgray url("http://lorempixel.com/720/480/abstract/2/") no-repeat center/cover'},
	{name: 'light image', value: 'lightgray url("http://lorempixel.com/720/480/cats/9/") no-repeat center/cover'},
	{name: 'random image', value: 'gray url("http://lorempixel.com/720/480/") no-repeat center/cover'}
]));

setAddon(infoAddon);

function loadStories () {
	require('../stories/moonstone-stories/Button.js');
	require('../stories/moonstone-stories/IconButton.js');
	require('../stories/moonstone-stories/Picker.js');
	require('../stories/moonstone-stories/RangePicker.js');
}

configure(loadStories, module);
