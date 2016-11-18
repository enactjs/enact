/**
 * Exports the {@link module:@enact/moonstone/ContextualPopup.ContextualPopupBase} component. The
 * default export is {@link module:@enact/moonstone/ContextualPopup.ContextualPopupBase}.
 *
 * @module @enact/moonstone/ContextualPopup
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import IconButton from '../IconButton';

import css from './ContextualPopup.less';

/**
 * {@link module:@enact/moonstone/ContextualPopup.ContextualPopupArrow} is a SVG arrow for
 * {@link module:@enact/moonstone/ContextualPopup.ContextualPopupBase}.
 *
 * @class ContextualPopupArrow
 * @ui
 * @private
 */
const ContextualPopupArrow = kind({
	name: 'ContextualPopupArrow',

	propTypes: {
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
		<svg {...props} className={className} style={position}>
			<path d="M15 0 L0 18 L30 18 Z" className={css.arrowBorder} />
			<path d="M15 9 L0 27 L30 27 Z" className={css.arrowFill} />
		</svg>
	)
});

/**
 * {@link module:@enact/moonstone/ContextualPopup.ContextualPopupBase} is a modal component that
 * appears in context to an activator.
 *
 * @class ContextualPopupBase
 * @ui
 * @public
 */
const ContextualPopupBase = kind({
	name: 'ContextualPopup',

	propTypes: {
		/**
		 * [children description]
		 * @type {[type]}
		 */
		children: PropTypes.oneOfType([
			PropTypes.arrayOf(React.PropTypes.element),
			PropTypes.element
		]).isRequired,

		/**
		 * [arrowPosition description]
		 *
		 * @type {Object}
		 * @public
		 */
		arrowPosition: PropTypes.object,

		/**
		 * [containerPosition description]
		 *
		 * @type {Object}
		 * @public
		 */
		containerPosition: PropTypes.object,

		/**
		 * [containerRef description]
		 *
		 * @type {Function}
		 * @public
		 */
		containerRef: PropTypes.func,

		/**
		 * [direction description]
		 *
		 * @type {String}
		 * @public
		 * @default 'down'
		 */
		direction: PropTypes.oneOf(['up', 'down', 'left', 'right']),

		/**
		 * A function to run when close button is clicked.
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
