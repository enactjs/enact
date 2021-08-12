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

_Layout.parameters = {
	info: {
		text: 'Basic usage of Layout'
	}
};

_Layout.args = {
	'align': 'start',
	'orientation': 'horizontal',
	'cell size': 100,
	'shrinkable cell': false
};

_Layout.argTypes = {
	'align': {
		options: ['start', 'center', 'stretch', 'end'],
		control: {
			type: 'select'
		},
		table: {
			category: Layout.displayName
		}
	},
	'orientation': {
		options: ['horizontal', 'vertical'],
		control: {
			type: 'select'
		},
		table: {
			category: Layout.displayName
		}
	},
	'cell size': {
		control: {
			type: 'range',
			min: 0,
			max: 300,
			step: 5
		},
		table: {
			category: Cell.displayName
		}
	},
	'shrinkable cell': {
		table: {
			category: Cell.displayName
		}
	}
};
