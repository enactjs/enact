import kind from '@enact/core/kind';
import Slottable from '@enact/ui/Slottable';
import React from 'react';

import css from './Panel.less';

/**
* {@link moonstone/Panel.Panel} is the default kind for controls created inside a
* [moonstone/Panels]{@link moonstone/Panels.Panels} container. A `moonstone/Panels`
* will typically contain several instances of these.
*
* @class Panel
* @memberof moonstone/Panels
* @ui
* @public
*/
const PanelBase = kind({

	name: 'Panel',

	styles: {
		css,
		className: 'panel'
	},

	render: ({children, header, ...rest}) => (
		<article {...rest}>
			<div className={css.header}>{header}</div>
			<section className={css.body}>{children}</section>
		</article>
	)
});

// Note that we only export this (even as PanelBase).  PanelBase is not useful on its own.
const Panel = Slottable({slots: ['header']}, PanelBase);

export default Panel;
export {Panel, Panel as PanelBase};
