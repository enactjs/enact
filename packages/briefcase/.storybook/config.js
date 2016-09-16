import {configure, setAddon, addDecorator} from '@kadira/storybook';
import infoAddon from '@kadira/react-storybook-addon-info';
import backgrounds from 'react-storybook-addon-backgrounds';
import Moonstone from '../src/MoonstoneEnvironment';

addDecorator(Moonstone);
addDecorator(backgrounds([
	{name: 'default', value: '#000000'},
	{name: 'image', value: 'gray url("http://lorempixel.com/720/480/") no-repeat center/cover'}
]));

setAddon(infoAddon);

function loadStories () {
	require('../stories/moonstone-stories/Picker.js');
}

configure(loadStories, module);
