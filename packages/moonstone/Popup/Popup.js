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
 * {@link module:@enact/moonstone/Popup~Popup} is a modal component that appears at the bottom of
 * the screen and takes up the full screen width.
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

		/**
		 * When `true`, popups will not animate on/off screen.
		 * @type {Boolean}
		 * @default false
		 */
		noAnimation: PropTypes.bool,

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
		 * A function to run after transition for hiding is finished.
		 * @type {Function}
		 */
		onHide: PropTypes.func,

		/**
		 * When `true`, the close button is shown; when `false`, it is hidden.
		 *
		 * @type {Boolean}
		 * @default false
		 */
		showCloseButton: PropTypes.bool,

		/**
		 * Indicates where component should attach to.
		 *
		 * @type {String}
		 * @default 'window'
		 */
		target: PropTypes.oneOf(['window', 'activator'])
	},

	defaultProps: {
		anchor: {bottom: 0},
		noAnimation: false,
		open: false,
		target: 'window',
		showCloseButton: false
	},

	styles: {
		css,
		className: 'popup moon-neutral'
	},

	computed: {
		className: ({showCloseButton, styler}) => styler.append({reserveClose: showCloseButton}),
		closeButton: ({showCloseButton}) => {
			if (showCloseButton) {
				return (
					<IconButton className={css.closeButton} backgroundOpacity="transparent" small>closex</IconButton>
				);
			}
		},
		zIndex: ({style}) => {
			if (style) {
				return {zIndex: style.zIndex};
			}
		}
	},

	render: ({closeButton, children, noAnimation, open, onHide, zIndex, ...rest}) => {
		delete rest.anchor;
		delete rest.showCloseButton;
		return (
			<TransitionContainer
				noAnimation={noAnimation}
				data-container-disabled={!open}
				visible={open}
				direction="down"
				duration="short"
				type="slide"
				fit
				style={zIndex}
				onHide={onHide}
			>
				<div {...rest}>
					{closeButton}
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
