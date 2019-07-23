import Layout, {Cell} from '@enact/ui/Layout';
import ri from '@enact/ui/resolution';
import Button from '@enact/moonstone/Button';
import Item from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf} from '@storybook/react';

import {boolean, number, select} from '../../src/enact-knobs';

Layout.displayName = 'Layout';
Cell.displayName = 'Cell';

storiesOf('UI', module)
	.add(
		'Layout',
		() => (
			<div className="debug" style={{height: ri.unit(399, 'rem')}}>
				<Layout
					align={select('align', ['start', 'center', 'stretch', 'end'], Layout, 'start')}
					orientation={select('orientation', ['horizontal', 'vertical'], Layout, 'horizontal')}
				>
					<Cell size={number('cell size', Cell, {range: true, min: 0, max: 300, step: 5}, 100) + 'px'} shrink>
						<Button small>First</Button>
					</Cell>
					<Cell shrink={boolean('shrinkable cell', Cell)}>
						<Button small>Second</Button>
					</Cell>
					<Cell>
						<Item>An auto-sizing Item that has a marquee so it will always show the full text string even if it&apos;s too long to fit</Item>
					</Cell>
					<Cell shrink>
						<Button>Last</Button>
					</Cell>
				</Layout>
			</div>
		),
		{
			info: {
				text: 'Basic usage of Layout'
			}
		}
	);
