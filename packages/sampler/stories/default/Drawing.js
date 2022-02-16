import Drawing from '@enact/ui/Drawing';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {boolean, range, select} from '@enact/storybook-utils/addons/controls';

const DrawingConfig = mergeComponentMetadata('Drawing', Drawing);

export default {
	title: 'UI/Drawing',
	component: 'Drawing'
};

export const _Drawing = (args) => (
	<Drawing
		brushColor={args['brushColor']}
		brushSize={args['brushSize']}
		canvasColor={args['canvasColor']}
		isErasing={args['isErasing']}
	/>
);

select('brushColor', _Drawing, ['red', 'green', 'blue']);
select('canvasColor', _Drawing, ['black', 'white']);
range('brushSize', _Drawing, DrawingConfig, {min: 1, max: 50}, 4);
boolean('isErasing', _Drawing);

_Drawing.parameters = {
	info: {
		text: 'Basic usage of Drawing'
	}
};
