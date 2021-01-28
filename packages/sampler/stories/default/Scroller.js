import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, select} from '@enact/storybook-utils/addons/knobs';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import React from 'react';
import ri from '@enact/ui/resolution';
import {Scroller} from '@enact/ui/Scroller';

const prop = {
	direction: ['both', 'horizontal', 'vertical'],
	scrollbarOption: ['auto', 'hidden', 'visible'],
	scrollModeOption: ['native', 'translate']
};

const scrollerConfig = mergeComponentMetadata('Scroller', Scroller);

export default {
	title: 'UI'
};

export const _Scroller = () => (
	<Scroller
		direction={select('direction', prop.direction, scrollerConfig)}
		horizontalScrollbar={select('horizontalScrollbar', prop.scrollbarOption, scrollerConfig)}
		key={select('scrollMode', prop.scrollModeOption, scrollerConfig)}
		noScrollByWheel={boolean('noScrollByWheel', scrollerConfig)}
		onScrollStart={action('onScrollStart')}
		onScrollStop={action('onScrollStop')}
		scrollMode={select('scrollMode', prop.scrollModeOption, scrollerConfig)}
		verticalScrollbar={select('verticalScrollbar', prop.scrollbarOption, scrollerConfig)}
	>
		<div
			style={{
				height: ri.scaleToRem(2004),
				width: ri.scaleToRem(4002)
			}}
		>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br />
			Aenean id blandit nunc. Donec lacinia nisi vitae mi dictum, eget pulvinar
			nunc tincidunt. Integer vehicula tempus rutrum. Sed efficitur neque in
			arcu dignissim cursus.
			<div
				style={{
					marginTop: ri.scaleToRem(1602)
				}}
			>
				Mauris blandit sollicitudin mattis. Fusce commodo arcu vitae risus
				consectetur sollicitudin. Aliquam eget posuere orci. Cras pellentesque
				lobortis sapien non lacinia.
			</div>
		</div>
	</Scroller>
);

_Scroller.story = {
	parameters: {
	  info: {
		text: 'Basic usage of Scroller',
	  },
	},
  };
