import {configure, setAddon, addDecorator} from '@kadira/storybook';
import infoAddon from '@kadira/react-storybook-addon-info';
import {withKnobs} from '@kadira/storybook-addon-knobs';
import backgrounds from 'react-storybook-addon-backgrounds';
import Moonstone from '../src/MoonstoneEnvironment';
const req = require.context('../stories/qa-stories', true, /.js$/);

addDecorator(Moonstone);
addDecorator(withKnobs);
addDecorator(backgrounds([
	{name: 'black', value: '#000000', default: true},
	{name: 'white', value: '#ffffff'},
	{name: 'dark image', value: 'darkgray url("http://lorempixel.com/720/480/abstract/2/") no-repeat center/cover'},
	{name: 'light image', value: 'lightgray url("http://lorempixel.com/720/480/cats/9/") no-repeat center/cover'},
	{name: 'random image', value: 'gray url("http://lorempixel.com/720/480/") no-repeat center/cover'}
]));

setAddon(infoAddon);

function loadStories () {
	req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
