import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import {shape} from '@enact/ui/ViewManager';
import Slottable from '@enact/ui/Slottable';
import Measurable from '@enact/ui/Measurable';

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
		 * A slot to insert additional Panels-level buttons into the global-navigation area.
		 *
		 * @type {Node}
		 * @public
		 */
		controls: PropTypes.node,

		/**
		 * The measurement bounds of the controls node
		 *
		 * @type {Object}
		 * @private
		 */
		controlsMeasurements: PropTypes.object,

		/**
		 * The method which receives the reference node to the controls element, used to determine
		 * the `controlsMeasurements`.
		 *
		 * @type {Function|Object}
		 * @private
		 */
		controlsRef: PropTypes.oneOfType([
			PropTypes.func,
			PropTypes.shape({current: PropTypes.any})
		]),

		/**
		 * Unique identifier for the Panels instance
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
		noCloseButton: false
	},

	styles: {
		css,
		className: 'panels enact-fit'
	},

	computed: {
		className: ({controls, noCloseButton, styler}) => styler.append({
			'moon-panels-hasControls': (!noCloseButton || !!controls) // If there is a close button or controls were specified
		}),
		controls: ({closeButtonAriaLabel, closeButtonBackgroundOpacity, controls, controlsRef, id, noCloseButton, onApplicationClose}) => {
			let closeButton;
			if (!noCloseButton) {
				const closeId = id ? `${id}_close` : null;

				closeButton = (
					<ApplicationCloseButton
						aria-label={closeButtonAriaLabel}
						backgroundOpacity={closeButtonBackgroundOpacity}
						className={css.close}
						id={closeId}
						onApplicationClose={onApplicationClose}
					/>
				);
			}
			if (controls || closeButton) {
				return (
					<div className={css.controls} ref={controlsRef}>
						{controls}
						{closeButton}
					</div>
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
		},
		style: ({controlsMeasurements, style = {}}) => (controlsMeasurements ? {
			...style,
			'--moon-panels-controls-width': controlsMeasurements.width + 'px'
		} : style)
	},

	render: ({arranger, childProps, children, controls, generateId, index, noAnimation, ...rest}) => {
		delete rest.closeButtonBackgroundOpacity;
		delete rest.closeButtonAriaLabel;
		delete rest.controlsMeasurements;
		delete rest.controlsRef;
		delete rest.noCloseButton;
		delete rest.onApplicationClose;
		delete rest.onBack;

		return (
			<div {...rest}>
				{controls}
				<Viewport
					arranger={arranger}
					childProps={childProps}
					generateId={generateId}
					index={index}
					noAnimation={noAnimation}
				>
					{children}
				</Viewport>
			</div>
		);
	}
});


const PanelsDecorator = compose(
	Slottable({slots: ['controls']}),
	CancelDecorator({cancel: 'onBack'}),
	Measurable({refProp: 'controlsRef', measurementProp: 'controlsMeasurements'}),
	IdProvider,
	Skinnable
);

const Panels = PanelsDecorator(PanelsBase);

export default Panels;
export {
	Panels,
	PanelsBase
};
