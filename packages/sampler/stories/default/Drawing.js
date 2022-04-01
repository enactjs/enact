import Drawing, {DrawingBase} from '@enact/ui/Drawing';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import {color, number, range, select} from '@enact/storybook-utils/addons/controls';

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

color('brushColor', _Drawing, DrawingConfig, '#FFFFFF');
range('brushSize', _Drawing, DrawingConfig, {min: 1, max: 50}, 4);
color('canvasColor', _Drawing, DrawingConfig, '#000000');
number('canvasHeight', _Drawing, DrawingConfig, 500);
number('canvasWidth', _Drawing, DrawingConfig, 800);
select('drawingTool', _Drawing, ['brush', 'fill', 'triangle', 'rectangle', 'circle', 'erase'], DrawingConfig);
color('fillColor', _Drawing, DrawingConfig, '#FF0000');

_Drawing.parameters = {
	info: {
		text: 'Basic usage of Drawing'
	}
};
