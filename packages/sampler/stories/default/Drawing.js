import Drawing, {DrawingBase} from '@enact/ui/Drawing';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {number, range, select} from '@enact/storybook-utils/addons/controls';

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
		canvasHeight={args['canvasHeight']}
		canvasWidth={args['canvasWidth']}
		drawingTool={args['drawingTool']}
		fillColor={args['fillColor']}
	/>
);

select('brushColor', _Drawing, ['red', 'green', 'blue'], DrawingConfig);
range('brushSize', _Drawing, DrawingConfig, {min: 1, max: 50}, 4);
select('canvasColor', _Drawing, ['black', 'white'], DrawingConfig);
number('canvasHeight', _Drawing, DrawingConfig, 500);
number('canvasWidth', _Drawing, DrawingConfig, 800);
select('drawingTool', _Drawing, ['brush', 'fill', 'triangle', 'rectangle', 'circle', 'erase'], DrawingConfig);
select('fillColor', _Drawing, ['red', 'green', 'blue'], DrawingConfig);

_Drawing.parameters = {
	info: {
		text: 'Basic usage of Drawing'
	}
};
