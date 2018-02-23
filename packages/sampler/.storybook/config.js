import perf from 'react-addons-perf';
import configure from '../src/configure';
import { setOptions } from '@kadira/storybook-addon-options';

const stories = require.context('../stories/moonstone-stories', true, /.js$/);

if (typeof window === 'object') {
	window.ReactPerf = perf;
}

setOptions({
	name: 'ENACT SAMPLER',
	url: 'http://enactjs.com/',
	goFullScreen: false,
	showLeftPanel: true,
	showDownPanel: true,
	showSearchBox: false,
	downPanelInRight: false,
});

configure(stories, module);
