import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import Item from '../Item';
import {MarqueeDecorator} from '../Marquee';

import css from './LabeledItem.less';

const LabeledItemBase = kind({
	name: 'LabeledItem',

	propTypes : {
		children: PropTypes.node,
		label: PropTypes.node
	},

	styles: {
		css,
		className: 'labeleditem'
	},

	render: ({children, label, ...rest}) => (
		<Item {...rest} component='div'>
			{children}
			{(label != null) ? (<div className={css.label}>{label}</div>) : null}
		</Item>
	)
});

const LabeledItem = MarqueeDecorator(
	{className: css.text},
	LabeledItemBase
);

export default LabeledItem;
export {LabeledItem, LabeledItemBase};
