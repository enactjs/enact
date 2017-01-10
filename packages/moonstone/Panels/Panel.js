import kind from '@enact/core/kind';
import React from 'react';
import Slottable from '@enact/ui/Slottable';
import {SpotlightContainerDecorator} from '@enact/spotlight';

import css from './Panel.less';

/**
* {@link moonstone/Panels.Panel} is the default kind for controls created inside a
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

	propTypes: /** @lends moonstone/Panels.Panel.prototype */ {
		/**
		 * When `true`, only the `header` is rendered and the body components are not. Setting to
		 * `true` will cause all components to be rendered and the body components will fade in.
		 *
		 * When a Panel is used within {@link moonstone/Panels.Panels},
		 * {@link moonstone/Panels.ActivityPanels}, or {@link moonstone/Panels.AlwaysViewingPanels},
		 * this property will be set automatically to `true` on render and `false` after animating
		 * into view.
		 *
		 * @type {Boolean}
		 */
		entering: React.PropTypes.bool,

		/**
		 * Header for the panel. This is usually passed by the {@link ui/Slottable.Slottable} API by
		 * using a [Header]{@link moonstone/Panels.Header} component as a child of the Panel.
		 *
		 * @type {Header}
		 * @public
		 */
		header: React.PropTypes.node
	},

	styles: {
		css,
		className: 'panel'
	},

	computed: {
		children: ({children, entering}) => entering ? null : children,
		bodyClassName: ({entering, styler}) => styler.append({
			body: true,
			visible: !entering
		})
	},

	render: ({bodyClassName, children, header, ...rest}) => {
		delete rest.entering;

		return (
			<article {...rest}>
				<div className={css.header}>{header}</div>
				<section className={bodyClassName}>{children}</section>
			</article>
		);
	}
});

const Panel = SpotlightContainerDecorator(
	Slottable(
		{slots: ['header']},
		PanelBase
	)
);

export default Panel;
export {Panel, PanelBase};
