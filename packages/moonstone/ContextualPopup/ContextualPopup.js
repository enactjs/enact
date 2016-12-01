/**
 * Exports the {@link module:moonstone/ContextualPopup.ContextualPopup} component.
 *
 * @module moonstone/ContextualPopup
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import IconButton from '../IconButton';

import css from './ContextualPopup.less';

/**
 * {@link module:moonstone/ContextualPopup.ContextualPopupArrow} is an SVG arrow for
 * {@link module:moonstone/ContextualPopup.ContextualPopup}.
 *
 * @class ContextualPopupArrow
 * @ui
 * @private
 * @memberof moonstone/ContextualPopup
 */
const ContextualPopupArrow = kind({
	name: 'ContextualPopupArrow',

	propTypes: /* @lends moonstone/ContextualPopup.ContextualPopupArrow.prototype */ {
		direction: PropTypes.oneOf(['up', 'down', 'left', 'right']),
		position: PropTypes.object
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

	render: ({className, position, ...props}) => (
		<svg {...props} className={className} style={position} viewBox="0 0 30 30">
			<path d="M15 0 L0 18 L30 18 Z" className={css.arrowBorder} />
			<path d="M15 9 L0 27 L30 27 Z" className={css.arrowFill} />
		</svg>
	)
});

/**
 * {@link module:moonstone/ContextualPopup.ContextualPopup} is a modal component that
 * appears in context to an activator.
 *
 * @class ContextualPopup
 * @memberof moonstone/ContextualPopup
 * @ui
 * @public
 */
const ContextualPopupBase = kind({
	name: 'ContextualPopup',

	propTypes: /* @lends moonstone/ContextualPopup.ContextualPopup.prototype */ {
		/**
		 * The element(s) to be displayed in the body of the popup.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.oneOfType([
			PropTypes.arrayOf(React.PropTypes.element),
			PropTypes.element
		]).isRequired,

		/**
		 * Style object for arrow position.
		 *
		 * @type {Object}
		 * @public
		 */
		arrowPosition: PropTypes.object,

		/**
		 * Style object for container position.
		 *
		 * @type {Object}
		 * @public
		 */
		containerPosition: PropTypes.object,

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
		onCloseButtonClicked: PropTypes.func,

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
		className: 'contextualPopup container moon-neutral'
	},

	computed: {
		className: ({showCloseButton, styler}) => styler.append({reserveClose: showCloseButton}),
		closeButton: ({showCloseButton, onCloseButtonClicked}) => {
			if (showCloseButton) {
				return (
					<IconButton
						className={css.closeButton}
						backgroundOpacity="transparent"
						small
						onClick={onCloseButtonClicked}
					>
						closex
					</IconButton>
				);
			}
		}
	},

	render: ({arrowPosition, containerPosition, containerRef, className, children, closeButton, direction, ...props}) => {
		delete props.onCloseButtonClicked;
		delete props.showCloseButton;

		return (
			<div {...props} className={css.contextualPopup}>
				<div className={className} style={containerPosition} ref={containerRef}>
					{closeButton}
					{children}
				</div>
				<ContextualPopupArrow direction={direction} position={arrowPosition} />
			</div>
		);
	}
});

export default ContextualPopupBase;
export {ContextualPopupBase as ContextualPopup, ContextualPopupBase};
