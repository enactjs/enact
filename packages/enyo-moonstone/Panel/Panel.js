import kind from 'enyo-core/kind';
import {Slot, Slottable} from 'enyo-ui/Slot';
import React from 'react';

import css from './Panel.less';

/**
* {@link module:moonstone/Panel~Panel} is the default kind for controls created inside a
* [moonstone/Panels]{@link module:moonstone/Panels~Panels} container. A `moonstone/Panels`
* will typically contain several instances of `moonstone/Panel`.
*
* @class Panel
* @ui
* @public
*/

const PanelBase = kind({

	name: 'Panel',

	styles: {
		css,
		classes: 'panel'
	},

	render: ({slottable, classes, ...rest}) => {
		return (
			<section {...rest} className={classes}>
				<Slot name="header">{slottable}</Slot>
				<div className={css.body}>
					<Slot>{slottable}</Slot>
				</div>
			</section>
		);
	}
});

const Panel = Slottable(PanelBase);

export default Panel;
export {Panel, PanelBase};
