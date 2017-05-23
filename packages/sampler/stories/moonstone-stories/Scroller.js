import ri from '@enact/ui/resolution';
import Scroller, {ScrollerBase} from '@enact/moonstone/Scroller';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {select, boolean} from '@kadira/storybook-addon-knobs';

import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('Scroller', ScrollerBase, Scroller);

const
	prop = {
		horizontalScrollbar: ['auto', 'hidden', 'visible'],
		verticalScrollbar: ['auto', 'hidden', 'visible']
	},
	style = {
		scroller: {
			height: ri.scale(550) + 'px',
			width: '100%'
		},
		content: {
			height: ri.scale(1000) + 'px',
			width: ri.scale(2000) + 'px'
		},
		bottom: {
			marginTop: ri.scale(800) + 'px'
		}
	};

const
	selectDirection = () => {
		const
			vertical = boolean('direction (vertical)', true),
			horizontal = boolean('direction (horizontal)', false);
		let
			directionValue, returnValue;

		if (vertical && horizontal) {
			directionValue = '[\'horizontal\', \'vertical\']';
			returnValue = 	['horizontal', 'vertical'];
		} else if (vertical) {
			directionValue = returnValue = 'vertical';
		} else if (horizontal) {
			directionValue = returnValue = 'horizontal';
		} else {
			directionValue = '(default value)';
			returnValue = undefined;
		}
		select('direction (actual value)', [directionValue], directionValue);
		return returnValue;
	};

storiesOf('Scroller')
	.addWithInfo(
		' ',
		'Basic usage of Scroller',
		() => (
			<Scroller
				direction={selectDirection()}
				horizontalScrollbar={select('horizontalScrollbar', prop.horizontalScrollbar, 'auto')}
				onScrollStart={action('onScrollStart')}
				onScrollStop={action('onScrollStop')}
				style={style.scroller}
				verticalScrollbar={select('verticalScrollbar', prop.verticalScrollbar, 'auto')}
			>
				<div style={style.content}>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br />
					Aenean id blandit nunc. Donec lacinia nisi vitae mi dictum, eget pulvinar nunc tincidunt. Integer vehicula tempus rutrum. Sed efficitur neque in arcu dignissim cursus.
					<div style={style.bottom}>
						Mauris blandit sollicitudin mattis. Fusce commodo arcu vitae risus consectetur sollicitudin. Aliquam eget posuere orci. Cras pellentesque lobortis sapien non lacinia.
					</div>
				</div>
			</Scroller>
		),
		{propTables: [Config]}
	);
