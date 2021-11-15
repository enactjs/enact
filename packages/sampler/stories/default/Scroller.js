import {action} from '@enact/storybook-utils/addons/actions';
import {boolean, select} from '@enact/storybook-utils/addons/controls';
import {mergeComponentMetadata} from '@enact/storybook-utils';
import ri from '@enact/ui/resolution';
import {Scroller} from '@enact/ui/Scroller';

const prop = {
	direction: ['both', 'horizontal', 'vertical'],
	scrollbarOption: ['auto', 'hidden', 'visible'],
	scrollModeOption: ['native', 'translate']
};

const scrollerConfig = mergeComponentMetadata('Scroller', Scroller);

export default {
	title: 'UI/Scroller',
	component: 'Scroller'
};

export const _Scroller = (args) => (
	<Scroller
		direction={args['direction']}
		horizontalScrollbar={args['horizontalScrollbar']}
		key={args['scrollMode']}
		noScrollByWheel={args['noScrollByWheel']}
		onScrollStart={action('onScrollStart')}
		onScrollStop={action('onScrollStop')}
		scrollMode={args['scrollMode']}
		verticalScrollbar={args['verticalScrollbar']}
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

select('direction', _Scroller, prop.direction, scrollerConfig);
select('horizontalScrollbar', _Scroller, prop.scrollbarOption, scrollerConfig);
boolean('noScrollByWheel', _Scroller, scrollerConfig);
select('scrollMode', _Scroller, prop.scrollModeOption, scrollerConfig);
select('verticalScrollbar', _Scroller, prop.scrollbarOption, scrollerConfig);

_Scroller.parameters = {
	info: {
		text: 'Basic usage of Scroller'
	}
};
