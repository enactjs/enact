import kind from '@enact/core/kind';
import Uppercase from '@enact/i18n/Uppercase';
import React from 'react';
import PropTypes from 'prop-types';

import Skinnable from '../Skinnable';

import TooltipLabel from './TooltipLabel';
import css from './Tooltip.less';

/**
 * [TooltipBase]{@link moonstone/TooltipDecorator.TooltipBase} is a stateless tooltip component with
 * the Moonston styling applied.
 *
 * @class TooltipBase
 * @memberof moonstone/TooltipDecorator
 * @ui
 * @public
 */
const TooltipBase = kind({
	name: 'Tooltip',

	propTypes: /** @lends moonstone/TooltipDecorator.TooltipBase.prototype */ {
		/**
		 * The node to be displayed as the main content of the tooltip.
		 *
		 * @type {Node}
		 * @required
		 */
		children: PropTypes.node.isRequired,

		/**
		 * Position of tooltip arrow in relation to the activator.
		 *
		 * * Values: `'left'`, `'center'`, `'right'`, `'top'`, `'middle'`, `'bottom'`
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
		 * Direction of label in relation to the activator.
		 *
		 * * Values: `'above'`, `'below'`, `'left'`, and `'right'`
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
			bottom: PropTypes.number,
			left: PropTypes.number,
			right: PropTypes.number,
			top: PropTypes.number
		}),

		/**
		 * Called when the tooltip mounts/unmounts, giving a reference to the DOM.
		 *
		 * @type {Function}
		 * @public
		 */
		tooltipRef: PropTypes.func,

		/**
		 * The width of tooltip content in pixels (px).
		 *
		 * If the content goes over the given width, then it will automatically wrap. When `null`,
		 * content does not wrap.
		 *
		 * @type {Number|null}
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
 * [Tooltip]{@link moonstone/TooltipDecorator.Tooltip} is a tooltip component with Moonstone styling
 * applied. If the Tooltip's child component is text, it will be uppercased unless
 * `casing` is set.
 *
 * @class Tooltip
 * @memberof moonstone/TooltipDecorator
 * @mixes i18n/Uppercase.Uppercase
 * @ui
 * @public
 */
const Tooltip = Skinnable(Uppercase(TooltipBase));

export default Tooltip;
export {Tooltip, TooltipBase};
