import Drawing, {DrawingBase} from '@enact/ui/Drawing';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {boolean, range, select} from '@enact/storybook-utils/addons/controls';

const DrawingConfig = mergeComponentMetadata('Drawing', Drawing, DrawingBase);

export default {
	title: 'UI/Drawing',
	component: 'Drawing'
};

export const _Drawing = (args) => (
	<Drawing
		brushColor={args['brushColor']}
		brushSize={args['brushSize']}
		canvasColor={args['canvasColor']}
		drawingTool={args['drawingTool']}
		fillColor={args['fillColor']}
		isErasing={args['isErasing']}
	/>
);

select('brushColor', _Drawing, ['red', 'green', 'blue'], DrawingConfig);
range('brushSize', _Drawing, DrawingConfig, {min: 1, max: 50}, 4);
select('canvasColor', _Drawing, ['black', 'white'], DrawingConfig);
select('drawingTool', _Drawing, ['brush', 'fill'], DrawingConfig);
select('fillColor', _Drawing, ['red', 'green', 'blue'], DrawingConfig);
boolean('isErasing', _Drawing, DrawingConfig);

_Drawing.parameters = {
	info: {
		text: 'Basic usage of Drawing'
	}
};
