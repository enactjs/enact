import configure from '../src/configure';
const stories = require.context('../stories/qa-stories', true, /.js$/);

configure(stories, module);
