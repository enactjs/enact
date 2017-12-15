import configure from '../src/configure';
import { setOptions } from '@storybook/addon-options';

const stories = require.context('../stories/moonstone-stories', true, /.js$/);

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
