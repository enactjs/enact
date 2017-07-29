import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import {isRtlText} from '@enact/i18n/util';
import React from 'react';
import PropTypes from 'prop-types';

import componentCss from './Tooltip.less';

/**
 * {@link ui/Tooltip.TooltipLabelBaseFactory} is Factory wrapper around
 * {@link ui/Tooltip.TooltipLabelBase} that allows overriding certain classes at design time.
 * The following are properties of the `css` member of the argument to the factory.
 *
 * @class TooltipLabelBaseFactory
 * @memberof ui/TooltipDecorator
 * @factory
 * @ui
 * @public
 */
const TooltipLabelBaseFactory = factory({css: componentCss}, ({css}) => {
	/**
	 * {@link ui/TooltipDecorator.TooltipLabel} is a stateless tooltip component with no styling
	 * applied.
	 *
	 * @class TooltipLabel
	 * @memberof ui/TooltipDecorator
	 * @ui
	 * @private
	 */
	return kind({
		name: 'TooltipLabel',

		propTypes: /** @lends ui/TooltipDecorator.TooltipLabel.prototype */ {
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
});

const TooltipLabelBase = TooltipLabelBaseFactory();

export default TooltipLabelBase;
export {
	TooltipLabelBase as TooltipLabel,
	TooltipLabelBase,
	TooltipLabelBaseFactory as TooltipLabelFactory,
	TooltipLabelBaseFactory
};
