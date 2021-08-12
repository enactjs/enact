import {action} from '@enact/storybook-utils/addons/actions';
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

_Scroller.parameters = {
	info: {
		text: 'Basic usage of Scroller'
	}
};

_Scroller.args = {
	'direction': scrollerConfig.defaultProps['direction'],
	'horizontalScrollbar': scrollerConfig.defaultProps['horizontalScrollbar'],
	'noScrollByWheel': scrollerConfig.defaultProps['noScrollByWheel'],
	'scrollMode': scrollerConfig.defaultProps['scrollMode'],
	'verticalScrollbar': scrollerConfig.defaultProps['verticalScrollbar']
};

_Scroller.argTypes = {
	'direction': {
		options: prop.direction,
		control: {
			type: 'select'
		}
	},
	'horizontalScrollbar': {
		options: prop.scrollbarOption,
		control: {
			type: 'select'
		}
	},
	'scrollMode': {
		options: prop.scrollModeOption,
		control: {
			type: 'select'
		}
	},
	'verticalScrollbar': {
		options: prop.scrollbarOption,
		control: {
			type: 'select'
		}
	}
};
