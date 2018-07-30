import Layout, {Cell} from '@enact/ui/Layout';
import ri from '@enact/ui/resolution';
import Button from '@enact/moonstone/Button';
import Item from '@enact/moonstone/Item';
import React from 'react';
import {storiesOf} from '@kadira/storybook';
import {boolean, number, select} from '@kadira/storybook-addon-knobs';

import nullify from '../../src/utils/nullify.js';
import {mergeComponentMetadata} from '../../src/utils/propTables';

const Config = mergeComponentMetadata('Layout', Layout);

storiesOf('Layout')
	.addWithInfo(
		' ',
		'Basic usage of Layout',
		() => (<div className="debug" style={{height: ri.unit(399, 'rem')}}>
			<Layout
				align={select('align', ['start', 'center', 'stretch', 'end'], 'start')}
				orientation={select('orientation', ['horizontal', 'vertical'], 'horizontal')}
			>
				<Cell size={number('cell size', 100, {range: true, min: 0, max: 300, step: 5}) + 'px'} shrink>
					<Button small>First</Button>
				</Cell>
				<Cell shrink={nullify(boolean('shrinkable cell', false))}>
					<Button small>Second</Button>
				</Cell>
				<Cell>
					<Item>An auto-sizing Item that has a marquee so it will always show the full text string even if it&apos;s too long to fit</Item>
				</Cell>
				<Cell shrink>
					<Button>Last</Button>
				</Cell>
			</Layout>
		</div>),
		{propTables: [Config]}
	);
