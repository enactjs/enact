import perf from 'react-addons-perf';
import configure from '../src/configure';
const stories = require.context('../stories/moonstone-stories', true, /.js$/);

if (typeof window === 'object') {
	window.ReactPerf = perf;
}

configure(stories, module);
