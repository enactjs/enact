import {forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import Spotlight from '@enact/spotlight';
import SpotlightContainerDecorator, {spotlightDefaultClass} from '@enact/spotlight/SpotlightContainerDecorator';
import Slottable from '@enact/ui/Slottable';
import PropTypes from 'prop-types';
import React from 'react';

import SharedStateDecorator from '../internal/SharedStateDecorator';

import css from './Panel.module.less';

let panelId = 0;

/**
 * A Panel is the standard view container used inside a [Panels]{@link moonstone/Panels.Panels} view
 * manager instance.
 *
 * [Panels]{@link moonstone/Panels.Panels} will typically contain several instances of these and
 * transition between them.
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
 		 * The "aria-label" for the Panel.
		 *
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
		 * When used within [Panels]{@link moonstone/Panels.Panels}, this prop may be set by
		 * `Panels` to "default-element" when navigating "forward" to a higher index. This behavior
		 * may be overridden by setting `autoFocus` on the `Panel` instance as a child of `Panels`
		 * or by wrapping `Panel` with a custom component and overriding the value passed by
		 * `Panels`.
		 *
		 * ```
		 * // Panel within CustomPanel will always receive "last-focused"
		 * const CustomPanel = (props) => <Panel {...props} autoFocus="last-focused" />;
		 *
		 * // The first panel will always receive "last-focused". The second panel will receive
		 * // "default-element" when navigating from the first panel but `autoFocus` will be unset
		 * // when navigating from the third panel and as a result will default to "last-focused".
		 * const MyPanels = () => (
		 *   <Panels>
		 *     <Panel autoFocus="last-focused" />
		 *     <Panel />
		 *     <Panel />
		 *   </Panels>
		 * );
		 * ```
		 *
		 * @type {String}
		 * @default 'last-focused'
		 * @public
		 */
		autoFocus: PropTypes.string,

		/**
		 * Header for the panel.
		 *
		 * This is usually passed by the [Slottable]{@link ui/Slottable.Slottable} API by using a
		 * [Header]{@link moonstone/Panels.Header} component as a child of the Panel.
		 *
		 * @type {Header}
		 * @public
		 */
		header: PropTypes.node,

		/**
		 * Hides the body components.
		 *
		 * When a Panel is used within [`Panels`]{@link moonstone/Panels.Panels},
		 * [`ActivityPanels`]{@link moonstone/Panels.ActivityPanels}, or
		 * [`AlwaysViewingPanels`]{@link moonstone/Panels.AlwaysViewingPanels},
		 * this property will be set automatically to `true` on render and `false` after animating
		 * into view.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		hideChildren: PropTypes.bool
	},

	defaultProps: {
		autoFocus: 'last-focused',
		hideChildren: false
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
				Spotlight.focus(spotlightId);
			}
		}
	},

	computed: {
		spotOnRender: ({autoFocus, hideChildren, spotOnRender}) => {
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

		return (
			<article role="region" {...rest} aria-labelledby={headerId} ref={spotOnRender}>
				<div className={css.header} id={headerId}>{header}</div>
				<section className={bodyClassName}>{children}</section>
			</article>
		);
	}
});

const Panel = SharedStateDecorator(
	{idProp: 'data-index'},
	SpotlightContainerDecorator(
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
	)
);

export default Panel;
export {Panel, PanelBase};
