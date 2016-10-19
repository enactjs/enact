/**
 * Exports the {@link module:@enact/moonstone/Popup~Popup}
 *
 * @module @enact/moonstone/Popup
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';
import Transition from '@enact/ui/Transition';
import {SpotlightContainerDecorator} from '@enact/spotlight';

import Layerable from '../Layerable';
import IconButton from '../IconButton';

import css from './Popup.less';

const TransitionContainer = SpotlightContainerDecorator(Transition);

/**
 * {@link module:@enact/moonstone/Popup~Popup}
 *
 * @class Popup
 * @ui
 * @public
 */
const PopupBase = kind({
	name: 'Popup',

	propTypes: {
		/**
		 * The element(s) to be displayed in the body of the popup.
		 *
		 * @type {Node}
		 * @public
		 */
		children: React.PropTypes.oneOfType([
			React.PropTypes.arrayOf(React.PropTypes.element),
			React.PropTypes.element
		]).isRequired,

		anchor: PropTypes.object,

		// should fire a provided method when popup is opened and after closed.

		/**
		 * Is this control in the expanded state (true), opened, with the contents visible?
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		open: PropTypes.bool,

		/**
		 * Allocate space for the close button so the body of the dialog doesn't overlap the button.
		 * Enabling this reduces the available width of the body content.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		reserveClose: PropTypes.bool
	},

	defaultProps: {
		anchor: {bottom: 0},
		open: false,
		reserveClose: false
	},

	styles: {
		css,
		className: 'popup moon-neutral'
	},

	computed: {
		className: ({reserveClose, styler}) => styler.append({reserveClose})
	},

	render: ({children, open, ...rest}) => {
		delete rest.anchor;
		delete rest.reserveClose;
		return (
			<TransitionContainer data-container-disabled={!open} visible={open} direction="down" duration="short" type="slide">
				<div {...rest}>
					<IconButton className={css.closeButton} backgroundOpacity="transparent" small>closex</IconButton>
					<div className={css.body}>
						{children}
					</div>
				</div>
			</TransitionContainer>
		);
	}
});

const Popup = Layerable(PopupBase);

export default Popup;
export {Popup, PopupBase};
