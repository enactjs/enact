import deprecate from '@enact/core/internal/deprecate';
import {forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Slottable from '@enact/ui/Slottable';
import Spotlight from '@enact/spotlight';
import SpotlightContainerDecorator, {spotlightDefaultClass} from '@enact/spotlight/SpotlightContainerDecorator';

import css from './Panel.less';

let panelId = 0;

// Called when `noAutoFocus` is true. Warns the first time and returns the new `autoFocus` value
const adaptToAutoFocus = deprecate(() => 'none', {
	name: 'noAutoFocus',
	since: '1.3.0',
	until: '2.0.0',
	replacedBy: 'autoFocus'
});

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
		 * Sets the strategy used to automatically focus an element within the panel upon render.
		 *
		 * * "none" - Automatic focus is disabled
		 * * "last-focused" - The element last focused in the panel with be restored
		 * * "default-element" - The first spottable component within the body will be focused
		 * * Custom Selector - A custom CSS selector may also be provided which will be used to find
		 *   the target within the Panel
		 *
		 * @type {String}
		 * @default 'last-focused'
		 * @public
		 */
		autoFocus: PropTypes.string,

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
		 * When `true`, the contents of the Panel will not receive spotlight focus after being
		 * rendered.
		 *
		 * @deprecated Replaced by `autoFocus="none"`
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAutoFocus: PropTypes.bool
	},

	defaultProps: {
		autoFocus: 'last-focused',
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
		),
		spotOnRender: (node, {autoFocus}) => {
			if (node && !Spotlight.getCurrent()) {
				const {spotlightId} = node.dataset;
				const config = {
					enterTo: 'last-focused'
				};

				if (autoFocus !== 'last-focused') {
					config.enterTo = 'default-element';

					if (autoFocus !== 'default-element') {
						config.defaultElement = autoFocus;
					}
				}

				Spotlight.set(spotlightId, config);
				Spotlight.setActiveContainer(spotlightId);
				Spotlight.focus(spotlightId);
			}
		}
	},

	computed: {
		spotOnRender: ({autoFocus, hideChildren, noAutoFocus, spotOnRender}) => {
			if (noAutoFocus) {
				autoFocus = adaptToAutoFocus();
			}

			// In order to spot the body components, we defer spotting until !hideChildren. If the
			// Panel opts out of hideChildren support by explicitly setting it to false, it'll spot
			// on first render.
			if (hideChildren || autoFocus === 'none') {
				return null;
			}

			return spotOnRender;
		},
		children: ({children, hideChildren}) => hideChildren ? null : children,
		bodyClassName: ({header, hideChildren, styler}) => styler.join({
			body: true,
			noHeader: !header,
			visible: !hideChildren
		}),
		// nulling headerId prevents the aria-labelledby relationship which is necessary to allow
		// aria-label to take precedence
		// (see https://www.w3.org/TR/wai-aria/states_and_properties#aria-labelledby)
		headerId: ({'aria-label': label}) => label ? null : `panel_${++panelId}_header`
	},

	render: ({bodyClassName, children, header, headerId, spotOnRender, ...rest}) => {
		delete rest.autoFocus;
		delete rest.hideChildren;
		delete rest.noAutoFocus;

		return (
			<article role="region" {...rest} aria-labelledby={headerId} ref={spotOnRender}>
				<div className={css.header} id={headerId}>{header}</div>
				<section className={bodyClassName}>{children}</section>
			</article>
		);
	}
});

const Panel = SpotlightContainerDecorator(
	{
		// prefer any spottable within the panel body for first render
		continue5WayHold: true,
		defaultElement: [`.${spotlightDefaultClass}`, `.${css.body} *`],
		enterTo: 'last-focused',
		preserveId: true
	},
	Slottable(
		{slots: ['header']},
		PanelBase
	)
);

export default Panel;
export {Panel, PanelBase};
