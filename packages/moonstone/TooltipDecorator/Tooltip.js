import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import Skinnable from '../Skinnable';

import TooltipLabel from './TooltipLabel';
import css from './Tooltip.module.less';

/**
 * A stateless tooltip component with Moonstone styling applied.
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
		 * A value representing the amount to offset the label portion of the tooltip.
		 *
		 * In a "center" aligned tooltip, the label may be desirable to offset to one side or the
		 * other. This prop accepts a value betwen -0.5 and 0.5 (representing 50% to the left or
		 * right). This defaults to 0 offset (centered). It also automatically caps the value so it
		 * never positions the tooltip label past the anchored arrow. If the tooltip label or arrow
		 * has non-rectangular geometry (rounded corners, a wide tail, etc), you'll need to manually
		 * account for that in your provided offset value.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		labelOffset: PropTypes.number,

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
		 * Anchors the tooltip relative to its container.
		 *
		 * Reconfigures the component to anchor itself to the designated edge of its container.
		 * When this is not specified, the implication is that the component is "absolutely"
		 * positioned, relative to the viewport, rather than its parent layer.
		 *
		 * @type {Boolean}
		 * @public
		 */
		relative: PropTypes.bool,

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
		direction: 'above',
		labelOffset: 0
	},

	styles: {
		css,
		className: 'tooltip'
	},

	computed: {
		labelOffset: ({labelOffset}) => {
			if (labelOffset) {
				const cappedPosition = Math.max(-0.5, Math.min(0.5, labelOffset));
				return {transform: `translateX(${cappedPosition * 100}%)`};
			}
		},
		className: ({direction, arrowAnchor, relative, styler}) => styler.append(direction, `${arrowAnchor}Arrow`, {relative, absolute: !relative}),
		style: ({position, style}) => {
			return {
				...style,
				...position
			};
		}
	},

	render: ({children, tooltipRef, width, labelOffset, ...rest}) => {
		delete rest.arrowAnchor;
		delete rest.labelOffset;
		delete rest.direction;
		delete rest.position;
		delete rest.relative;

		return (
			<div {...rest}>
				<div className={css.tooltipAnchor}>
					<div className={css.tooltipArrow} />
					<TooltipLabel tooltipRef={tooltipRef} width={width} style={labelOffset}>
						{children}
					</TooltipLabel>
				</div>
			</div>
		);
	}
});

/**
 * A tooltip component with Moonstone styling applied. If the Tooltip's child component is text, it
 * will be uppercased unless `casing` is set.
 *
 * @class Tooltip
 * @memberof moonstone/TooltipDecorator
 * @mixes i18n/Uppercase.Uppercase
 * @ui
 * @public
 */
const Tooltip = Skinnable(TooltipBase);

export default Tooltip;
export {Tooltip, TooltipBase};
