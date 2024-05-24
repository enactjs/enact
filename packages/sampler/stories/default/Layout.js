import {boolean, range, select} from '@enact/storybook-utils/addons/controls';
import Item from '@enact/ui/Item';
import Layout, {Cell} from '@enact/ui/Layout';
import ri from '@enact/ui/resolution';

import * as css from './Layout.module.less';

Layout.displayName = 'Layout';
Cell.displayName = 'Cell';

export default {
	title: 'UI/Layout',
	component: 'Layout'
};

export const _Layout = (args) => (
	<div className="debug" style={{height: ri.unit(399, 'rem')}}>
		<Layout
			align={args['align']}
			className={css.layout}
			orientation={args['orientation']}
		>
			<Cell
				size={args['first cell size'] + 'px'}
				shrink
			>
				<Item>First&#xa0;(shrink)</Item>
			</Cell>
			<Cell shrink={args['shrinkable second cell']}>
				<Item>Second&#xa0;(shrinkable)</Item>
			</Cell>
			<Cell
				grow={args['growable third cell']}
				size={args['third cell size'] + 'px'}
			>
				<Item>Third&#xa0;(growable)</Item>
			</Cell>
			<Cell shrink>
				<Item>Last&#xa0;(shrink)</Item>
			</Cell>
		</Layout>
	</div>
);

select('align', _Layout, ['start', 'center', 'stretch', 'end'], Layout, 'start');
select('orientation', _Layout, ['horizontal', 'vertical'], Layout, 'horizontal');
range('first cell size', _Layout, Cell, {min: 0, max: 300, step: 5}, 100);
boolean('shrinkable second cell', _Layout, Cell);
range('third cell size', _Layout, Cell, {min: 0, max: 600, step: 5}, 120);
boolean('growable third cell', _Layout, Cell);

_Layout.parameters = {
	info: {
		text: 'Basic usage of Layout'
	}
};
