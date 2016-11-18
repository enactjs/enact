import Button from '@enact/moonstone/Button';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select, text} from '@kadira/storybook-addon-knobs';

const prop = {
	tooltipPosition: {
		'below left': 'below left',
		'below right': 'below right',
		'below center': 'below center',
		'above left': 'above left',
		'above right': 'above right',
		'above center': 'above center',
		'right top': 'right top',
		'right center': 'right center',
		'right bottom': 'right bottom',
		'left top': 'left top',
		'left center': 'left center',
		'left bottom': 'left bottom'
	}
}

storiesOf('Tooltip')
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'The basic Tooltip',
		() => (
			<div style={{position: 'absolute', left: '50%', transform: 'translateX(-50%)'}}>
				<Button
					tooltip={text('tooltip', 'tooltip!')}
					tooltipPosition={select('tooltipPosition', prop.tooltipPosition, 'below left')}
				>
					hello
				</Button>
			</div>
		)
	);
