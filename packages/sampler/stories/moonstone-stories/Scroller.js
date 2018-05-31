import {Scroller as UiScroller} from '@enact/ui/Scroller';
import Scroller from '@enact/moonstone/Scroller';
import ri from '@enact/ui/resolution';
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {boolean, select} from '@storybook/addon-knobs';
import {withInfo} from '@storybook/addon-info';

import nullify from '../../src/utils/nullify.js';

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
			propTablesExclude: [UiScroller],
			text: 'Basic usage of Scroller'
		})(() => (
			<UiScroller
				direction={select('direction', prop.direction, 'both')}
				horizontalScrollbar={select('horizontalScrollbar', prop.horizontalScrollbar, 'auto')}
				onScrollStart={action('onScrollStart')}
				onScrollStop={action('onScrollStop')}
				style={{
					height: ri.unit(552, 'rem'),
					width: '100%'
				}}
				verticalScrollbar={select('verticalScrollbar', prop.verticalScrollbar, 'auto')}
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
			propTablesExclude: [Scroller],
			text: 'Basic usage of Scroller'
		})(() => (
			<Scroller
				direction={select('direction', prop.direction, 'both')}
				focusableScrollbar={nullify(boolean('focusableScrollbar', false))}
				horizontalScrollbar={select('horizontalScrollbar', prop.horizontalScrollbar, 'auto')}
				onScrollStart={action('onScrollStart')}
				onScrollStop={action('onScrollStop')}
				style={{
					height: ri.unit(552, 'rem'),
					width: '100%'
				}}
				verticalScrollbar={select('verticalScrollbar', prop.verticalScrollbar, 'auto')}
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
