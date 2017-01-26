import kind from '@enact/core/kind';
import React from 'react';
import Slottable from '@enact/ui/Slottable';
import {Spotlight, SpotlightContainerDecorator} from '@enact/spotlight';

import css from './Panel.less';

const spotPanel = (node) => {
	if (node && !node.contains(document.activeElement)) {
		const body = node.querySelector('section .spottable');
		const header = node.querySelector('header .spottable');
		const spottable = body || header;

		if (spottable) {
			Spotlight.focus(spottable);
		}
	}
};

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
		 * Header for the panel. This is usually passed by the {@link ui/Slottable.Slottable} API by
		 * using a [Header]{@link moonstone/Panels.Header} component as a child of the Panel.
		 *
		 * @type {Header}
		 * @public
		 */
		header: React.PropTypes.node,

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
		 * @default false
		 * @public
		 */
		showChildren: React.PropTypes.bool
	},

	defaultProps: {
		showChildren: false
	},

	styles: {
		css,
		className: 'panel'
	},

	computed: {
		// In order to spot the body components, we defer spotting until !showChildren. If the Panel
		// opts out of showChildren support by explicitly setting it to false, it'll spot on first
		// render.
		spotOnRender: ({showChildren}) => showChildren ? null : spotPanel,
		children: ({children, showChildren}) => showChildren ? null : children,
		bodyClassName: ({showChildren, styler}) => styler.join({
			body: true,
			visible: !showChildren
		})
	},

	render: ({bodyClassName, children, header, spotOnRender, ...rest}) => {
		delete rest.showChildren;

		return (
			<article {...rest} ref={spotOnRender}>
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
