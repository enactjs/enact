import Button from '@enact/moonstone/Button';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

const prop = {
	tooltipPosition: {
		'above center': 'above center',
		'above left': 'above left',
		'above right': 'above right',
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
}

storiesOf('Tooltip')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'The basic Tooltip',
		() => (
			<div style={{textAlign: 'center'}}>
				<Button
					tooltip={text('tooltip', 'tooltip!')}
					tooltipPosition={select('tooltipPosition', prop.tooltipPosition, 'below left')}
				>
					hello
				</Button>
			</div>
		)
	);