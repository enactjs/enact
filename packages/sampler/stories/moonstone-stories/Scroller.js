import Scroller, {ScrollerBase} from '@enact/moonstone/Scroller';
import ri from '@enact/ui/resolution';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {boolean, select} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('Scroller', ScrollerBase, Scroller);

const
	prop = {
		direction: ['both', 'horizontal', 'vertical'],
		horizontalScrollbar: ['auto', 'hidden', 'visible'],
		verticalScrollbar: ['auto', 'hidden', 'visible']
	},
	style = {
		scroller: {
			height: ri.scale(552) + 'px',
			width: '100%'
		},
		content: {
			height: ri.scale(1002) + 'px',
			width: ri.scale(2001) + 'px'
		},
		bottom: {
			marginTop: ri.scale(801) + 'px'
		}
	};

storiesOf('Scroller')
	.addWithInfo(
		' ',
		'Basic usage of Scroller',
		() => (
			<Scroller
				direction={select('direction', prop.direction, 'both')}
				focusableScrollbar={nullify(boolean('focusableScrollbar', false))}
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
