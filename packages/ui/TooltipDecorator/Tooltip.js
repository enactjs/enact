import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
// import {diffClasses} from '@enact/ui/MigrationAid';
import React from 'react';
import PropTypes from 'prop-types';

import UiTooltipLabel from './TooltipLabel';

import componentCss from './Tooltip.less';

/**
 * {@link ui/Tooltip.TooltipBaseFactory} is a Factory wrapper around {@link ui/Tooltip.TooltipBase}
 * that allows overriding certain classes at design time. The following are properties of the `css`
 * member of the argument to the factory.
 *
 * @class TooltipBaseFactory
 * @memberof ui/TooltipDecorator
 * @factory
 * @ui
 * @public
 */
const TooltipBaseFactory = factory({css: componentCss}, ({css}) => {
	// diffClasses('UI Tooltip', componentCss, css);

	/**
	 * {@link ui/TooltipDecorator.TooltipBase} is a stateless tooltip component with no styling
	 * applied.
	 *
	 * @class TooltipBase
	 * @memberof ui/TooltipDecorator
	 * @ui
	 * @public
	 */
	return kind({
		name: 'Tooltip',

		propTypes: /** @lends ui/TooltipDecorator.TooltipBase.prototype */ {
			/**
			 * The node to be displayed as the main content of the tooltip.
			 *
			 * @type {Node}
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
			 * The TooltipLabel component to use in this Tooltip.
			 *
			 * @type {Component}
			 * @default {@link ui/TooltipLabel}
			 * @public
			 */
			TooltipLabel: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),

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
			 * @type {Number|null}
			 * @public
			 */
			width: PropTypes.number
		},

		defaultProps: {
			arrowAnchor: 'right',
			direction: 'above',
			TooltipLabel: UiTooltipLabel
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

		render: ({children, TooltipLabel, tooltipRef, arrowType, width, ...rest}) => {
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
});

const TooltipBase = TooltipBaseFactory();

export default TooltipBase;
export {
	TooltipBase as Tooltip,
	TooltipBase,
	TooltipBaseFactory as TooltipFactory,
	TooltipBaseFactory
};
