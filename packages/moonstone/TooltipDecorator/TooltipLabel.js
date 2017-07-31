/**
 * Exports the {@link moonstone/TooltipLabel.TooltipLabel} and {@link moonstone/TooltipLabel.TooltipLabelBase}
 * components.  The default export is {@link moonstone/TooltipLabel.TooltipLabelBase}.
 *
 * @module moonstone/TooltipDecorator.TooltipLabel
 */

import factory from '@enact/core/factory';
// import {diffClasses} from '@enact/ui/MigrationAid';
import {TooltipLabelFactory as UiTooltipLabelFactory} from '@enact/ui/TooltipDecorator';

import componentCss from './Tooltip.less';

/**
 * {@link moonstone/TooltipDecorator.TooltipLabelBaseFactory} is a Factory wrapper around
 * {@link ui/TooltipDecorator.TooltipLabelBase} that allows overriding certain classes at design time.
 * The following are properties of the `css` member of the argument to the factory.
 *
 * @class TooltipLabelBaseFactory
 * @memberof moonstone/TooltipDecorator
 * @factory
 * @ui
 * @public
 */
const TooltipLabelBaseFactory = factory({css: componentCss}, ({css}) => {
	// diffClasses('Moon TooltipLabel', componentCss, css);

	return UiTooltipLabelFactory({
		/* Replace classes in this step */
		css: /** @lends moonstone/TooltipLabel.TooltipLabelFactory.prototype */ {
			...componentCss,
			// Include the component class name so it too may be overridden.
			tooltipLabel: css.tooltipLabel
		}
	});
});

/**
 * {@link moonstone/TooltipDecorator.TooltipLabelBase} is a stateless TooltipLabel with Moonstone
 * styling applied.
 *
 * @class TooltipLabel
 * @memberof moonstone/TooltipDecorator
 * @ui
 * @public
 */
const TooltipLabelBase = TooltipLabelBaseFactory();

export default TooltipLabelBase;
export {
	TooltipLabelBase as TooltipLabel,
	TooltipLabelBase,
	TooltipLabelBaseFactory as TooltipLabelFactory,
	TooltipLabelBaseFactory
};
