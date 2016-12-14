import kind from '@enact/core/kind';
import Uppercase from '@enact/i18n/Uppercase';
import React, {PropTypes} from 'react';

import css from './Tooltip.less';

/**
 * {@link moonstone/TooltipDecorator.TooltipBase} is a stateless tooltip component with
 * Moonston styling applied.
 *
 * @class TooltipBase
 * @memberof moonstone/TooltipDecorator/TooltipBase
 * @ui
 * @public
 */
const TooltipBase = kind({
	name: 'TooltipBase',

	propTypes: {
		/**
		 * The text to be displayed as the main content of the tooltip.
		 *
		 * @type {String}
		 * @required
		 */
		children: PropTypes.string.isRequired,

		/**
		 * Type of tooltip arrows.
		 *
 		 * @type {String}
 		 * @default 'corner'
 		 * @public
		 */
		arrowType: PropTypes.oneOf(['corner', 'edge']),

		/**
		 * Style object for tooltip position.
		 *
		 * @type {Object}
		 * @public
		 */
		position: PropTypes.shape({
			top: PropTypes.number,
			bottom: PropTypes.number,
			left: PropTypes.number,
			right: PropTypes.number
		}),

		/**
		 * The method to run when the tooltip mounts, giving a reference to the DOM.
		 *
		 * @type {Function}
		 * @public
		 */
		tooltipRef: PropTypes.func,

		/**
		 * Type of tooltip
		 *
		 * @type {String}
		 * @default 'above leftArrow'
		 * @public
		 */
		type: PropTypes.string
	},

	defaultProps: {
		arrowType: 'corner',
		type: 'above leftArrow'
	},

	styles: {
		css,
		className: 'tooltip'
	},

	computed: {
		className: ({type, styler}) => styler.append(css[type.split(' ')[0]], css[type.split(' ')[1]]),
		style: ({position, style}) => {
			return {
				...style,
				...position
			};
		}
	},

	render: ({children, tooltipRef, arrowType, ...rest}) => {
		delete rest.position;
		delete rest.type;

		return (
			<div {...rest}>
				<svg className={css.tooltipArrow} viewBox={'0 0 3 5'}>
					<path d={arrowType === 'edge' ? 'M0,5C0,4,1,3,3,2.5C1,2,0,1,0,0V5Z' : 'M0,5C0,3,1,0,3,0H0V5Z'} />
				</svg>
				<div
					ref={tooltipRef}
					className={css.tooltipLabel}
				>
					{children}
				</div>
			</div>
		);
	}
});

/**
 * {@link moonstone/TooltipDecorator.Tooltip} is a tooltip component with Moonstone styling
 * applied. If the Tooltip's child component is text, it will be uppercased unless
 * `preserveCase` is set.
 *
 * @class Tooltip
 * @memberof moonstone/TooltipDecorator
 * @see i18n/Uppercase
 * @ui
 * @public
 */
const Tooltip = Uppercase(TooltipBase);

export default Tooltip;
export {Tooltip, TooltipBase};
