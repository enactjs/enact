import Button from '@enact/moonstone/Button';
import TooltipDecorator, {Tooltip, TooltipBase} from '@enact/moonstone/TooltipDecorator';
import React from 'react';
import {storiesOf} from '@storybook/react';
// import {object} from '@storybook/addon-knobs';

import {boolean, number, object, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('TooltipDecorator', TooltipDecorator, Tooltip, TooltipBase);
const TooltipButton = TooltipDecorator({tooltipDestinationProp: 'decoration'}, Button);

const prop = {
	tooltipPosition: {
		'above': 'above',
		'above center': 'above center',
		'above left': 'above left',
		'above right': 'above right',
		'below': 'below',
		'below center': 'below center',
		'below left': 'below left',
		'below right': 'below right',
		'left bottom': 'left bottom',
		'left middle': 'left middle',
		'left top': 'left top',
		'right bottom': 'right bottom',
		'right middle': 'right middle',
		'right top': 'right top'
	},
	ariaObject: {
		'aria-hidden': false,
		'aria-label': 'Tooltip Label',
		'role': 'alert'
	}
};

storiesOf('Moonstone', module)
	.add(
		'TooltipDecorator',
		() => (
			<div style={{textAlign: 'center'}}>
				<TooltipButton
					tooltipDelay={number('tooltipDelay', Config, 500)}
					tooltipText={text('tooltipText', Config, 'tooltip!')}
					tooltipPosition={select('tooltipPosition', prop.tooltipPosition, Config, 'above')}
					tooltipRelative={boolean('tooltipRelative', Config)}
					tooltipWidth={number('tooltipWidth', Config)}
					tooltipProps={object('tooltipProps', Config, prop.ariaObject)}
				>
					hello
				</TooltipButton>
			</div>
		),
		{
			info: {
				text: 'The basic TooltipDecorator'
			}
		}
	);
