import {configure, setAddon} from '@kadira/storybook';
import infoAddon from '@kadira/react-storybook-addon-info';

setAddon(infoAddon);

function loadStories () {
	require('../stories/moonstone-stories/Picker.js');
}

configure(loadStories, module);
