import configure from '../src/configure';
import { setOptions } from '@kadira/storybook-addon-options';

const stories = require.context('../stories/qa-stories', true, /.js$/);

setOptions({
	name: 'ENACT SAMPLER',
	url: 'http://nebula.lgsvl.com/enyojs/enact-docs/develop/',
	goFullScreen: false,
	showLeftPanel: true,
	showDownPanel: true,
	showSearchBox: false,
	downPanelInRight: false,
});

configure(stories, module);
