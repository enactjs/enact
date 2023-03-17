import {boolean, range, select} from '@enact/storybook-utils/addons/controls';
import Item from '@enact/ui/Item';
import Layout, {Cell} from '@enact/ui/Layout';
import ri from '@enact/ui/resolution';

import css from './Layout.module.less';

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
				size={args['cell size'] + 'px'}
				shrink
			>
				<Item>First</Item>
			</Cell>
			<Cell shrink={args['shrinkable cell']}>
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

select('align', _Layout, ['start', 'center', 'stretch', 'end'], Layout, 'start');
select('orientation', _Layout, ['horizontal', 'vertical'], Layout, 'horizontal');
range('cell size', _Layout, Cell, {min: 0, max: 300, step: 5}, 100);
boolean('shrinkable cell', _Layout, Cell);

_Layout.parameters = {
	info: {
		text: 'Basic usage of Layout'
	}
};
