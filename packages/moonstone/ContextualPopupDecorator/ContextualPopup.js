import kind from '@enact/core/kind';
import {TextDecorator} from '@enact/i18n/Text';
import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '../IconButton';
import Skinnable from '../Skinnable';

import css from './ContextualPopup.less';

const CloseButton = TextDecorator({
	mapPropsToText: {
		'aria-label': {text: 'Close', defaultText: ''}
	}
}, IconButton);

/**
 * {@link moonstone/ContextualPopupDecorator/ContextualPopup.ContextualPopupArrow} is an SVG arrow for
 * {@link moonstone/ContextualPopupDecorator/ContextualPopup.ContextualPopup}.
 *
 * @class ContextualPopupArrow
 * @ui
 * @private
 * @memberof moonstone/ContextualPopupDecorator
 */
const ContextualPopupArrow = kind({
	name: 'ContextualPopupArrow',

	propTypes: /** @lends moonstone/ContextualPopupDecorator.ContextualPopupArrow.prototype */ {
		direction: PropTypes.oneOf(['up', 'down', 'left', 'right'])
	},

	defaultProps: {
		direction: 'down'
	},

	styles: {
		css,
		className: 'arrow'
	},

	computed: {
		className: ({direction, styler}) => styler.append(direction, css.arrow)
	},

	render: (props) => (
		<svg {...props} viewBox="0 0 30 30">
			<path d="M15 0 L0 18 L30 18 Z" className={css.arrowBorder} />
			<path d="M15 9 L0 27 L30 27 Z" className={css.arrowFill} />
		</svg>
	)
});

const ContextualPopupRoot = Skinnable(
	{defaultSkin: 'light'},
	'div'
);

/**
 * {@link moonstone/ContextualPopupDecorator.ContextualPopup} is a modal component that
 * appears in context to an activator.
 *
 * @class ContextualPopup
 * @memberof moonstone/ContextualPopupDecorator
 * @ui
 * @public
 */
const ContextualPopupBase = kind({
	name: 'ContextualPopup',

	propTypes: /** @lends moonstone/ContextualPopupDecorator.ContextualPopup.prototype */ {
		/**
		 * The element(s) to be displayed in the body of the popup.
		 *
		 * @type {Node}
		 * @required
		 * @public
		 */
		children: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.element),
			PropTypes.element
		]).isRequired,

		/**
		 * Style object for arrow position.
		 *
		 * @type {Object}
		 * @public
		 */
		arrowPosition: PropTypes.shape({
			top: PropTypes.number,
			bottom: PropTypes.number,
			left: PropTypes.number,
			right: PropTypes.number
		}),

		/**
		 * Style object for container position.
		 *
		 * @type {Object}
		 * @public
		 */
		containerPosition: PropTypes.shape({
			top: PropTypes.number,
			bottom: PropTypes.number,
			left: PropTypes.number,
			right: PropTypes.number
		}),

		/**
		 * A callback function to get the reference to the container node.
		 *
		 * @type {Function}
		 * @public
		 */
		containerRef: PropTypes.func,

		/**
		 * Direction of ContextualPopup. Can be one of: `'up'`, `'down'`, `'left'`, or `'right'`.
		 *
		 * @type {String}
		 * @public
		 * @default 'down'
		 */
		direction: PropTypes.oneOf(['up', 'down', 'left', 'right']),

		/**
		 * A function to be run when close button is clicked.
		 *
		 * @type {Function}
		 * @public
		 */
		onCloseButtonClick: PropTypes.func,

		/**
		 * When `true`, the close button is shown; when `false`, it is hidden.
		 *
		 * @type {Boolean}
		 * @public
		 * @default false
		 */
		showCloseButton: PropTypes.bool
	},

	defaultProps: {
		direction: 'down',
		showCloseButton: false
	},

	styles: {
		css,
		className: 'container'
	},

	computed: {
		className: ({showCloseButton, styler}) => styler.append({reserveClose: showCloseButton}),
		closeButton: ({showCloseButton, onCloseButtonClick}) => {
			if (showCloseButton) {
				return (
					<CloseButton
						className={css.closeButton}
						backgroundOpacity="transparent"
						small
						onTap={onCloseButtonClick}
					>
						closex
					</CloseButton>
				);
			}
		}
	},

	render: ({arrowPosition, containerPosition, containerRef, children, className, closeButton, direction, ...rest}) => {
		delete rest.onCloseButtonClick;
		delete rest.showCloseButton;

		return (
			<ContextualPopupRoot aria-live="off" role="alert" {...rest} className={css.contextualPopup}>
				<div className={className} style={containerPosition} ref={containerRef}>
					{children}
					{closeButton}
				</div>
				<ContextualPopupArrow direction={direction} style={arrowPosition} />
			</ContextualPopupRoot>
		);
	}
});

export default ContextualPopupBase;
export {ContextualPopupBase as ContextualPopup, ContextualPopupBase};
