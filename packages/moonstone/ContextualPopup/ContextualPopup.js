/**
 * Exports the {@link module:@enact/moonstone/ContextualPopup.ContextualPopup} and
 * {@link module:@enact/moonstone/ContextualPopup.ContextualPopupBase} component. The
 * default export is {@link module:@enact/moonstone/ContextualPopup.ContextualPopup}.
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
		direction: PropTypes.oneOf(['up', 'down', 'left', 'right'])
	},

	defaultProps: {
		direction: 'left'
	},

	styles: {
		css,
		className: 'arrow'
	},

	computed: {
		className: ({direction, styler}) => styler.append(direction, css.arrow)
	},

	render: ({className}) => (
		<svg className={className}>
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
		 * [direction description]
		 * @type {String}
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
		 * @default false
		 */
		showCloseButton: PropTypes.bool
	},

	defaultProps: {
		showCloseButton: false
	},

	styles: {
		css,
		className: 'contextualPopup moon-neutral'
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

	render: ({children, closeButton, direction, ...props}) => {
		delete props.onCloseButtonClicked;
		delete props.showCloseButton;

		return (
			<div {...props}>
				<ContextualPopupArrow direction={direction} />
				<div>
					{closeButton}
					{children}
				</div>
			</div>
		);
	}
});

// TODO: Wrap with HOC
const ContextualPopup = ContextualPopupBase;

export default ContextualPopup;
export {ContextualPopupBase};
