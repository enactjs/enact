import Button from '@enact/moonstone/Button';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {boolean, number, select, text, withKnobs} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';

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
					disabled={nullify(boolean('disabled', false))}
					tooltipDelay={number('tooltipDelay', 500)}
					tooltipText={text('tooltipText', 'tooltip!')}
					tooltipPosition={select('tooltipPosition', prop.tooltipPosition, 'above')}
					tooltipPreserveCase={nullify(boolean('tooltipPreserveCase', false))}
					tooltipWidth={number('tooltipWidth')}
				>
					hello
				</Button>
			</div>
		)
	);
