import {Scroller as UiScroller} from '@enact/ui/Scroller';
import Scroller from '@enact/moonstone/Scroller';
import ri from '@enact/ui/resolution';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withInfo} from '@storybook/addon-info';

import {boolean, select} from '../../src/enact-knobs';
import {mergeComponentMetadata} from '../../src/utils';

const Config = mergeComponentMetadata('Scroller', Scroller, UiScroller);

const
	prop = {
		direction: ['both', 'horizontal', 'vertical'],
		horizontalScrollbar: ['auto', 'hidden', 'visible'],
		verticalScrollbar: ['auto', 'hidden', 'visible']
	};

storiesOf('UI', module)
	.add(
		'Scroller',
		withInfo({
			text: 'Basic usage of Scroller'
		})(() => (
			<UiScroller
				direction={select('direction', prop.direction, Config, 'both')}
				horizontalScrollbar={select('horizontalScrollbar', prop.horizontalScrollbar, Config, 'auto')}
				onScrollStart={action('onScrollStart')}
				onScrollStop={action('onScrollStop')}
				verticalScrollbar={select('verticalScrollbar', prop.verticalScrollbar, Config, 'auto')}
			>
				<div
					style={{
						height: ri.unit(1002, 'rem'),
						width: ri.unit(2001, 'rem')
					}}
				>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br />
					Aenean id blandit nunc. Donec lacinia nisi vitae mi dictum, eget pulvinar nunc tincidunt. Integer vehicula tempus rutrum. Sed efficitur neque in arcu dignissim cursus.
					<div
						style={{
							marginTop: ri.unit(801, 'rem')
						}}
					>
						Mauris blandit sollicitudin mattis. Fusce commodo arcu vitae risus consectetur sollicitudin. Aliquam eget posuere orci. Cras pellentesque lobortis sapien non lacinia.
					</div>
				</div>
			</UiScroller>
		))
	);

storiesOf('Moonstone', module)
	.add(
		'Scroller',
		withInfo({
			text: 'Basic usage of Scroller'
		})(() => (
			<Scroller
				direction={select('direction', prop.direction, Config, 'both')}
				focusableScrollbar={boolean('focusableScrollbar', Config)}
				horizontalScrollbar={select('horizontalScrollbar', prop.horizontalScrollbar, Config, 'auto')}
				onScrollStart={action('onScrollStart')}
				onScrollStop={action('onScrollStop')}
				verticalScrollbar={select('verticalScrollbar', prop.verticalScrollbar, Config, 'auto')}
			>
				<div
					style={{
						height: ri.unit(1002, 'rem'),
						width: ri.unit(2001, 'rem')
					}}
				>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br />
					Aenean id blandit nunc. Donec lacinia nisi vitae mi dictum, eget pulvinar nunc tincidunt. Integer vehicula tempus rutrum. Sed efficitur neque in arcu dignissim cursus.
					<div
						style={{
							marginTop: ri.unit(801, 'rem')
						}}
					>
						Mauris blandit sollicitudin mattis. Fusce commodo arcu vitae risus consectetur sollicitudin. Aliquam eget posuere orci. Cras pellentesque lobortis sapien non lacinia.
					</div>
				</div>
			</Scroller>
		))
	);
