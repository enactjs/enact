import kind from '@enact/core/kind';
import {isRtlText} from '@enact/i18n';
import Uppercase from '@enact/i18n/Uppercase';
import React, {PropTypes} from 'react';

import css from './Tooltip.less';

/**
 * {@link moonstone/TooltipDecorator.TooltipLabel} is a stateless tooltip component with
 * Moonston styling applied.
 *
 * @class TooltipLabel
 * @memberof moonstone/TooltipDecorator
 * @ui
 * @private
 */
const TooltipLabel = kind({
	name: 'TooltipLabel',

	propTypes: {
		/**
		 * The node to be displayed as the main content of the tooltip.
		 *
		 * @type {React.node}
		 * @required
		 */
		children: PropTypes.node.isRequired,

		/**
		 * The method to run when the tooltip mounts/unmounts, giving a reference to the DOM.
		 *
		 * @type {Function}
		 * @public
		 */
		tooltipRef: PropTypes.func,

		/**
		 * The width of tooltip content in pixels (px). If the content goes over the given width,
		 * then it will automatically wrap.
		 *
		 * @type {Number}
		 * @public
		 */
		width: PropTypes.number
	},

	styles: {
		css,
		className: 'tooltipLabel'
	},

	computed: {
		className: ({width, styler}) => styler.append({multi: !!width}),
		style: ({children, width, style}) => {
			return {
				...style,
				direction: isRtlText(children) ? 'rtl' : 'ltr',
				width
			};
		}
	},

	render: ({children, tooltipRef, ...rest}) => {
		delete rest.width;

		return (
			<div
				{...rest}
				ref={tooltipRef}
			>
				{children}
			</div>
		);
	}
});

/**
 * {@link moonstone/TooltipDecorator.TooltipBase} is a stateless tooltip component with
 * Moonston styling applied.
 *
 * @class TooltipBase
 * @memberof moonstone/TooltipDecorator
 * @ui
 * @public
 */
const TooltipBase = kind({
	name: 'TooltipBase',

	propTypes: /** @lends moonstone/TooltipDecorator.TooltipBase.prototype */ {
		/**
		 * The node to be displayed as the main content of the tooltip.
		 *
		 * @type {React.node}
		 * @required
		 */
		children: PropTypes.node.isRequired,

		/**
		 * Position of tooltip arrow in relation to the activator; valid values are
		 * `'left'`, `'center'`, `'right'`, `'top'`, `'middle'`, and `'bottom'`.
		 *
		 * Note that `'left'`, `'center'`, `'right'` are applicable when direction is in vertical
		 * orientation (i.e. `'above'`, `'below'`), and `'top'`, `'middle'`, and `'bottom'` are
		 * applicable when direction is in horizontal orientation (i.e. `'left'`, `'right'`)
		 *
		 * @type {String}
		 * @default 'right'
		 * @public
		 */
		arrowAnchor: PropTypes.oneOf(['left', 'center', 'right', 'top', 'middle', 'bottom']),

		/**
		 * Direction of label in relation to the activator; valid values are `'above'`, `'below'`,
		 * `'left'`, and `'right'`.
		 *
		 * @type {String}
		 * @default 'above'
		 * @public
		 */
		direction: PropTypes.oneOf(['above', 'below', 'left', 'right']),

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
		 * The method to run when the tooltip mounts/unmounts, giving a reference to the DOM.
		 *
		 * @type {Function}
		 * @public
		 */
		tooltipRef: PropTypes.func,

		/**
		 * The width of tooltip content in pixels (px). If the content goes over the given width,
		 * then it will automatically wrap texts.
		 *
		 * @type {Number}
		 * @public
		 */
		width: PropTypes.number
	},

	defaultProps: {
		arrowAnchor: 'right',
		direction: 'above'
	},

	styles: {
		css,
		className: 'tooltip'
	},

	computed: {
		arrowType: ({arrowAnchor}) => (arrowAnchor === 'center' || arrowAnchor === 'middle') ?
				'M0,5C0,4,1,3,3,2.5C1,2,0,1,0,0V5Z' : 'M0,5C0,3,1,0,3,0H0V5Z',
		className: ({direction, arrowAnchor, styler}) => styler.append(direction, `${arrowAnchor}Arrow`),
		style: ({position, style}) => {
			return {
				...style,
				...position
			};
		}
	},

	render: ({children, tooltipRef, arrowType, width, ...rest}) => {
		delete rest.arrowAnchor;
		delete rest.direction;
		delete rest.position;

		return (
			<div {...rest}>
				<svg className={css.tooltipArrow} viewBox="0 0 3 5">
					<path d={arrowType} />
				</svg>
				<TooltipLabel tooltipRef={tooltipRef} width={width}>
					{children}
				</TooltipLabel>
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
 * @mixes i18n/Uppercase.Uppercase
 * @ui
 * @public
 */
const Tooltip = Uppercase(TooltipBase);

export default Tooltip;
export {Tooltip, TooltipBase};
