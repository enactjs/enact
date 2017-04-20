import Button from '@enact/moonstone/Button';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {withKnobs, number, select, text} from '@kadira/storybook-addon-knobs';

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
	}
};

storiesOf('TooltipDecorator')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'The basic TooltipDecorator',
		() => (
			<div style={{textAlign: 'center'}}>
				<Button
					tooltipCasing={select('tooltipCasing', ['preserve', 'sentence', 'word', 'upper'], 'upper')}
					tooltipDelay={number('tooltipDelay', 500)}
					tooltipText={text('tooltipText', 'tooltip!')}
					tooltipPosition={select('tooltipPosition', prop.tooltipPosition, 'above')}
					tooltipWidth={number('tooltipWidth')}
				>
					hello
				</Button>
			</div>
		)
	);
