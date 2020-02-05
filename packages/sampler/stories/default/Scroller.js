import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, select} from '@enact/storybook-utils/addons/knobs';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import React from 'react';
import ri from '@enact/ui/resolution';
import {ScrollableBase as UiScrollableBase} from '@enact/ui/Scrollable';
import {Scroller as UiScroller, ScrollerBase as UiScrollerBase} from '@enact/ui/Scroller';
import {storiesOf} from '@storybook/react';

const
	prop = {
		direction: ['both', 'horizontal', 'vertical'],
		scrollbarOption: ['auto', 'hidden', 'visible']
	};

const UiScrollerConfig = mergeComponentMetadata('Scroller', UiScrollerBase, UiScrollableBase, UiScroller);

storiesOf('UI', module)
	.add(
		'Scroller',
		() => (
			<UiScroller
				direction={select('direction', prop.direction, UiScrollerConfig)}
				horizontalScrollbar={select('horizontalScrollbar', prop.scrollbarOption, UiScrollerConfig)}
				noScrollByWheel={boolean('noScrollByWheel', UiScrollerConfig)}
				onScrollStart={action('onScrollStart')}
				onScrollStop={action('onScrollStop')}
				verticalScrollbar={select('verticalScrollbar', prop.scrollbarOption, UiScrollerConfig)}
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
		),
		{
			info: {
				text: 'Basic usage of Scroller'
			}
		}
	);

