import {forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Slottable from '@enact/ui/Slottable';
import Spotlight from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import {spottableClass} from '@enact/spotlight/Spottable';

import css from './Panel.less';

const spotPanel = (node) => {
	if (node && !Spotlight.getCurrent()) {
		const {containerId} = node.dataset;

		// set the default element so that we can try to spot the container and let it fall through
		// to the default element if there isn't a lastFocusedElement/Index
		const body = node.querySelector(`section .${spottableClass}`);
		const header = node.querySelector(`header .${spottableClass}`);
		const defaultElement = body || header;

		Spotlight.set(containerId, {defaultElement});
		Spotlight.focus(containerId);
	}
};

let panelId = 0;

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
		 * By default, the panel will be labeled by its [Header]{@link moonstone/Panels.Header}.
		 * When `aria-label` is set, it will be used instead to provide an accessibility label for
		 * the panel.
		 *
		 * @memberof moonstone/Panels.Panel.prototype
		 * @type {String}
		 * @public
		 */
		'aria-label': PropTypes.string,

		/**
		 * Identifies an element (or elements) in order to define contextual parent/child relationship
		 * between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
		 * When `aria-owns` is set, it will be considered as children.
		 *
		 * @memberof moonstone/Panels.Panel.prototype
		 * @type {String}
		 * @public
		 */
		'aria-owns': PropTypes.string,

		/**
		 * Header for the panel. This is usually passed by the {@link ui/Slottable.Slottable} API by
		 * using a [Header]{@link moonstone/Panels.Header} component as a child of the Panel.
		 *
		 * @type {Header}
		 * @public
		 */
		header: PropTypes.node,

		/**
		 * When `true`, only the `header` is rendered and the body components are not. Setting to
		 * `false` will cause all components to be rendered and the body components will fade in.
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
		hideChildren: PropTypes.bool,

		/**
		 * When `true`, the contents of the Panel will not receive spotlight focus after being rendered.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAutoFocus: PropTypes.bool
	},

	defaultProps: {
		hideChildren: false,
		noAutoFocus: false
	},

	styles: {
		css,
		className: 'panel'
	},

	handlers: {
		onScroll: handle(
			forward('onScroll'),
			({currentTarget}) => {
				currentTarget.scrollTop = 0;
				currentTarget.scrollLeft = 0;
			}
		)
	},

	computed: {
		// In order to spot the body components, we defer spotting until !hideChildren. If the Panel
		// opts out of hideChildren support by explicitly setting it to false, it'll spot on first
		// render.
		spotOnRender: ({hideChildren, noAutoFocus}) => hideChildren || noAutoFocus ? null : spotPanel,
		children: ({children, hideChildren}) => hideChildren ? null : children,
		bodyClassName: ({header, hideChildren, styler}) => styler.join({
			body: true,
			noHeader: !header,
			visible: !hideChildren
		}),
		// nulling headerId prevents the aria-labelledby relationship which is necessary to allow
		// aria-label to take precedence
		// (see https://www.w3.org/TR/wai-aria/states_and_properties#aria-labelledby)
		headerId: ({'aria-label': label}) => label ? null : `panel_${++panelId}_header`,
		'aria-owns': ({'aria-owns': owns}) => owns ? `breadcrumb app_close_button ${owns}` : 'breadcrumb app_close_button'
	},

	render: ({'aria-owns': ariaOwns, bodyClassName, children, header, headerId, spotOnRender, ...rest}) => {
		delete rest.hideChildren;
		delete rest.noAutoFocus;

		return (
			<article role="region" {...rest} aria-labelledby={headerId} aria-owns={ariaOwns} ref={spotOnRender}>
				<div className={css.header} id={headerId}>{header}</div>
				<section className={bodyClassName}>{children}</section>
			</article>
		);
	}
});

const Panel = SpotlightContainerDecorator(
	{enterTo: 'last-focused', preserveId: true},
	Slottable(
		{slots: ['header']},
		PanelBase
	)
);

export default Panel;
export {Panel, PanelBase};
