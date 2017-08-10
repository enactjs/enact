import factory from '@enact/core/factory';
// import {diffClasses} from '@enact/ui/MigrationAid';
import {TooltipLabelFactory as UiTooltipLabelFactory} from '@enact/ui/TooltipDecorator';

import componentCss from './Tooltip.less';

/**
 * A Factory wrapper around {@link ui/TooltipDecorator.TooltipLabelBase} that allows overriding
 * certain classes at design time.  The following are properties of the `css` member of the argument
 * to the factory.
 *
 * @class TooltipLabelFactory
 * @memberof moonstone/TooltipDecorator
 * @factory
 * @private
 */
const TooltipLabelBaseFactory = factory({css: componentCss}, ({css}) => {
	// diffClasses('Moon TooltipLabel', componentCss, css);

	return UiTooltipLabelFactory({
		/* Replace classes in this step */
		css: /** @lends moonstone/TooltipDecorator.TooltipLabelFactory.prototype */ {
			...componentCss,
			// Include the component class name so it too may be overridden.
			tooltipLabel: css.tooltipLabel
		}
	});
});

/**
 * A stateless Tooltip label
 *
 * @class TooltipLabel
 * @memberof moonstone/TooltipDecorator
 * @ui
 * @private
 */
const TooltipLabelBase = TooltipLabelBaseFactory();

export default TooltipLabelBase;
export {
	TooltipLabelBase as TooltipLabel,
	TooltipLabelBase,
	TooltipLabelBaseFactory as TooltipLabelFactory,
	TooltipLabelBaseFactory
};
