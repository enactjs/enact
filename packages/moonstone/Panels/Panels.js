import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import {shape} from '@enact/ui/ViewManager';

import IdProvider from '../internal/IdProvider';
import Skinnable from '../Skinnable';

import ApplicationCloseButton from './ApplicationCloseButton';
import CancelDecorator from './CancelDecorator';
import Viewport from './Viewport';

import css from './Panels.module.less';

/**
 * Basic Panels component without breadcrumbs or default [arranger]{@link ui/ViewManager.Arranger}
 *
 * @class Panels
 * @memberof moonstone/Panels
 * @ui
 * @public
 */
const PanelsBase = kind({
	name: 'Panels',

	propTypes: /** @lends moonstone/Panels.Panels.prototype */ {
		/**
		 * Function that generates unique identifiers for Panel instances.
		 *
		 * @type {Function}
		 * @required
		 * @private
		 */
		generateId: PropTypes.func.isRequired,

		/**
		 * Set of functions that control how the panels are transitioned into and out of the
		 * viewport.
		 *
		 * @see ui/ViewManager.SlideArranger
		 * @type {ui/ViewManager.Arranger}
		 * @public
		 */
		arranger: shape,

		/**
		 * An object containing properties to be passed to each child.
		 *
		 *`aria-owns` will be added or updated to this object to add the close button to the
		 * accessibility tree of each panel.
		 *
		 * @type {Object}
		 * @public
		 */
		childProps: PropTypes.object,

		/**
		 * [`Panels`]{@link moonstone/Panels.Panel} to be rendered
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Sets the hint string read when focusing the application close button.
		 *
		 * @type {String}
		 * @default 'Exit app'
		 * @public
		 */
		closeButtonAriaLabel: PropTypes.string,

		/**
		 * The background opacity of the application close button.
		 *
		 * * Values: `'translucent'`, `'lightTranslucent'`, `'transparent'`
		 *
		 * @type {String}
		 * @default 'transparent'
		 * @public
		 */
		closeButtonBackgroundOpacity: PropTypes.oneOf(['translucent', 'lightTranslucent', 'transparent']),

		/**
		 * Unique identifier for the Panels instance.
		 *
		 * When defined, `Panels` will manage the presentation state of `Panel` instances in order
		 * to restore it when returning to the `Panel`. See
		 * [noSharedState]{@link moonstone/Panels.Panels.noSharedState} for more details on shared
		 * state.
		 *
		 * @type {String}
		 * @public
		 */
		id: PropTypes.string,

		/**
		 * Index of the active panel
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		index: PropTypes.number,

		/**
		 * Disables panel transitions.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAnimation: PropTypes.bool,

		/**
		 * Indicates the close button will not be rendered on the top right corner.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noCloseButton: PropTypes.bool,

		/**
		 * Prevents maintaining shared state for framework components within this `Panels` instance.
		 *
		 * When `false`, each `Panel` will track the state of some framework components in order to
		 * restore that state when the Panel is recreated. For example, the scroll position of a
		 * `moonstone/Scroller` within a `Panel` will be saved and restored when returning to that
		 * `Panel`.
		 *
		 * This only applied when navigating "back" (to a lower index) to `Panel`. When navigating
		 * "forwards" (to a higher index), the `Panel` and its contained components will use their
		 * default state.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noSharedState: PropTypes.bool,

		/**
		 * Called when the app close button is clicked.
		 *
		 * @type {Function}
		 * @public
		 */
		onApplicationClose: PropTypes.func,

		/**
		 * Called with cancel/back key events.
		 *
		 * @type {Function}
		 * @public
		 */
		onBack: PropTypes.func
	},

	defaultProps: {
		closeButtonBackgroundOpacity: 'transparent',
		index: 0,
		noAnimation: false,
		noCloseButton: false,
		noSharedState: false
	},

	styles: {
		css,
		className: 'panels enact-fit'
	},

	computed: {
		className: ({noCloseButton, styler}) => styler.append({
			hasCloseButton: !noCloseButton
		}),
		applicationCloseButton: ({closeButtonAriaLabel, closeButtonBackgroundOpacity, id, noCloseButton, onApplicationClose}) => {
			if (!noCloseButton) {
				const closeId = id ? `${id}_close` : null;

				return (
					<ApplicationCloseButton
						aria-label={closeButtonAriaLabel}
						backgroundOpacity={closeButtonBackgroundOpacity}
						className={css.close}
						id={closeId}
						onApplicationClose={onApplicationClose}
					/>
				);
			}
		},
		childProps: ({childProps, id, noCloseButton}) => {
			if (noCloseButton || !id) {
				return childProps;
			}

			const updatedChildProps = Object.assign({}, childProps);
			const closeId = `${id}_close`;
			const owns = updatedChildProps['aria-owns'];

			if (owns) {
				updatedChildProps['aria-owns'] = `${owns} ${closeId}`;
			} else {
				updatedChildProps['aria-owns'] = closeId;
			}

			return updatedChildProps;
		}
	},

	render: ({noAnimation, arranger, childProps, children, generateId, id, index, applicationCloseButton, noSharedState, ...rest}) => {
		delete rest.closeButtonBackgroundOpacity;
		delete rest.closeButtonAriaLabel;
		delete rest.noCloseButton;
		delete rest.onApplicationClose;
		delete rest.onBack;

		return (
			<div {...rest} id={id}>
				{applicationCloseButton}
				<Viewport
					arranger={arranger}
					childProps={childProps}
					generateId={generateId}
					id={`viewport-${id}`}
					index={index}
					noAnimation={noAnimation}
					noSharedState={noSharedState}
				>
					{children}
				</Viewport>
			</div>
		);
	}
});

const Panels = CancelDecorator(
	{cancel: 'onBack'},
	IdProvider(
		Skinnable(
			PanelsBase
		)
	)
);

export default Panels;
export {Panels, PanelsBase};
