import {boolean, number, select} from '@enact/storybook-utils/addons/knobs';
import Item from '@enact/ui/Item';
import Layout, {Cell} from '@enact/ui/Layout';
import React from 'react';
import ri from '@enact/ui/resolution';

import css from './Layout.module.less';

Layout.displayName = 'Layout';
Cell.displayName = 'Cell';

export default {
	title: 'UI/Layout'
};

export const _Layout = () => (
	<div className="debug" style={{height: ri.unit(50, 'rem')}}>
		<Layout
			align={select('align', ['start', 'center', 'stretch', 'end'], Layout, 'start')}
			className={css.layout}
			orientation={select('orientation', ['horizontal', 'vertical'], Layout, 'horizontal')}
		>
			<Cell
				size={number('cell size', Cell, {range: true, min: 0, max: 300, step: 5}, 100) + 'px'}
				shrink
			>
				<Item>First</Item>
			</Cell>
			<Cell shrink={boolean('shrinkable cell', Cell)}>
				<Item>Second</Item>
			</Cell>
			<Cell>
				<Item>Third</Item>
			</Cell>
			<Cell shrink>
				<Item>Last</Item>
			</Cell>
		</Layout>
	</div>
);

_Layout.story = {
	parameters: {
		info: {
			text: 'Basic usage of Layout'
		}
	}
};
