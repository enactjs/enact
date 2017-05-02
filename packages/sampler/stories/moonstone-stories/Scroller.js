import ri from '@enact/ui/resolution';
import Scroller, {ScrollerBase} from '@enact/moonstone/Scroller';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {select} from '@kadira/storybook-addon-knobs';

import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('Scroller', ScrollerBase, Scroller);

const
	prop = {
		horizontal: ['auto', 'hidden', 'scroll'],
		vertical: ['auto', 'hidden', 'scroll']
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

storiesOf('Scroller')
	.addWithInfo(
		' ',
		'Basic usage of Scroller',
		() => (
			<Scroller
				horizontal={select('horizontal', prop.horizontal, 'auto')}
				onScrollStart={action('onScrollStart')}
				onScrollStop={action('onScrollStop')}
				style={style.scroller}
				vertical={select('vertical', prop.vertical, 'auto')}
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
