import kind from '@enact/core/kind';
import {isRtlText} from '@enact/i18n/util';
import React from 'react';
import PropTypes from 'prop-types';

import css from './Tooltip.module.less';

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

	propTypes: /** @lends moonstone/TooltipDecorator.TooltipLabel.prototype */ {
		/**
		 * The node to be displayed as the main content of the tooltip.
		 *
		 * @type {Node}
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
		 * then it will automatically wrap. When `null`, content does not wrap.
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
			<div {...rest} ref={tooltipRef}>
				{children}
			</div>
		);
	}
});

export default TooltipLabel;
export {
	TooltipLabel
};
