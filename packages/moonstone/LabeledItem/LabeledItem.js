import kind from 'enact-core/kind';
import React, {PropTypes} from 'react';

import Item from '../Item';

import css from './LabeledItem.less';

export default kind({
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
		<Item {...rest}>
			<div className={css.text}>{children}</div>
			{(label != null) ? (<div className={css.label}>{label}</div>) : null}
		</Item>
	)
});
