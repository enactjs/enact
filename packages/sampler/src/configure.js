/* eslint enact/no-module-exports-import: off */

import {configure, setAddon, addDecorator} from '@kadira/storybook';
import infoAddon from '@kadira/react-storybook-addon-info';
import {withKnobs} from '@kadira/storybook-addon-knobs';
import backgrounds from 'react-storybook-addon-backgrounds';
import Moonstone from '../src/MoonstoneEnvironment';


function config (stories, mod) {
	addDecorator(Moonstone);
	addDecorator(withKnobs);
	addDecorator(backgrounds([
		{name: 'dark', value: '#000000', default: true},
		{name: 'light', value: '#e8e9e8'},
		{name: 'dark image', value: 'darkgray url("http://lorempixel.com/720/480/abstract/2/") no-repeat center/cover'},
		{name: 'light image', value: 'lightgray url("http://lorempixel.com/720/480/cats/9/") no-repeat center/cover'},
		{name: 'random image', value: 'gray url("http://lorempixel.com/720/480/") no-repeat center/cover'}
	]));

	setAddon(infoAddon);

	function loadStories () {
		stories.keys().forEach((filename) => stories(filename));
	}

	configure(loadStories, mod);
}

module.exports = config;
