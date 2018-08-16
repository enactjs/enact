import Button from '@enact/moonstone/Button';
import TooltipDecorator, {Tooltip, TooltipBase} from '@enact/moonstone/TooltipDecorator';
import React from 'react';
import {storiesOf} from '@storybook/react';
// import {object} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import {number, object, select, text} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('TooltipDecorator', TooltipDecorator, Tooltip, TooltipBase);
const TooltipButton = TooltipDecorator(Button);

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
		withInfo({
			text: 'The basic TooltipDecorator'
		})(() => (
			<div style={{textAlign: 'center'}}>
				<TooltipButton
					tooltipCasing={select('tooltipCasing', ['preserve', 'sentence', 'word', 'upper'], Config, 'upper')}
					tooltipDelay={number('tooltipDelay', Config, 500)}
					tooltipText={text('tooltipText', Config, 'tooltip!')}
					tooltipPosition={select('tooltipPosition', prop.tooltipPosition, Config, 'above')}
					tooltipWidth={number('tooltipWidth', Config)}
					tooltipProps={object('tooltipProps', Config, prop.ariaObject)}
				>
					hello
				</TooltipButton>
			</div>
		))
	);
