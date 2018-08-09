import configure from '../src/configure';
import {setOptions} from '@storybook/addon-options';

const stories = require.context('../stories/moonstone-stories', true, /.js$/);

setOptions({
	name: 'ENACT SAMPLER',
	url: 'http://enactjs.com/',
	goFullScreen: false,
	showStoriesPanel: true,
	showAddonPanel: true,
	showSearchBox: false,
	addonPanelInRight: false
});

configure(stories, module);
