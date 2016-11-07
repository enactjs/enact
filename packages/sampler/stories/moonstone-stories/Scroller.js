import ri from '@enact/ui/resolution';
import {Scroller, ScrollerBase} from '@enact/moonstone/Scroller';
import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, boolean, select} from '@kadira/storybook-addon-knobs';

Scroller.displayName = 'Scroller';
Scroller.propTypes = Object.assign({}, ScrollerBase.propTypes);
Scroller.defaultProps = Object.assign({}, ScrollerBase.defaultProps);

const
	// Set up some defaults for info and knobs
	prop = {
		horizontal: {'auto': 'auto', 'hidden': 'hidden', 'scroll': 'scroll'},
		vertical: {'auto': 'auto', 'hidden': 'hidden', 'scroll': 'scroll'}
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
	.addDecorator(withKnobs)
	.addWithInfo(
		' ',
		'Basic usage of Scroller',
		() => (
			<Scroller
				onScrollStart={action('onScrollStart')}
				onScrollStop={action('onScrollStop')}
				horizontal={select('horizontal', prop.horizontal, 'auto')}
				vertical={select('vertical', prop.vertical, 'auto')}
				hideScrollbars={boolean('hideScrollbars', false)}
				style={style.scroller}
			>
				<div style={style.content}>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br />
					Aenean id blandit nunc. Donec lacinia nisi vitae mi dictum, eget pulvinar nunc tincidunt. Integer vehicula tempus rutrum. Sed efficitur neque in arcu dignissim cursus.
					<div style={style.bottom}>
						Mauris blandit sollicitudin mattis. Fusce commodo arcu vitae risus consectetur sollicitudin. Aliquam eget posuere orci. Cras pellentesque lobortis sapien non lacinia.
					</div>
				</div>
			</Scroller>
		)
	);
