import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import React from 'react';
import Uppercase from '@enact/i18n/Uppercase';
// import {diffClasses} from '@enact/ui/MigrationAid';
import {TooltipFactory as UiTooltipFactory} from '@enact/ui/TooltipDecorator';
import {TooltipLabelFactory} from './TooltipLabel';

import Skinnable from '../Skinnable';

import componentCss from './Tooltip.less';

/**
 * A factory for customizing the visual style of
 * [TooltipBase]{@link moonstone/TooltipDecorator.TooltipBase}.
 *
 * @class TooltipBaseFactory
 * @memberof moonstone/TooltipDecorator
 * @factory
 * @public
 */
const TooltipBaseFactory = factory({css: componentCss}, ({css}) => {
	// diffClasses('Moon Tooltip', componentCss, css);

	const UiTooltip = UiTooltipFactory({
		/* Replace classes in this step */
		css: /** @lends moonstone/TooltipDecorator.TooltipBaseFactory.prototype */ {
			...componentCss,
			// Include the component class name so it too may be overridden.
			tooltip: css.tooltip
		}
	});
	const TooltipLabel = TooltipLabelFactory({css});

	return kind({
		name: 'Tooltip',

		styles: {
			css: componentCss,
			className: 'tooltip'
		},

		render: (props) => {
			return (
				<UiTooltip {...props} TooltipLabel={TooltipLabel} />
			);
		}
	});
});

/**
 * A stateless tooltip component.
 *
 * @class TooltipBase
 * @memberof moonstone/TooltipDecorator
 * @extends ui/TooltipDecorator.Tooltip
 * @ui
 * @public
 */
const TooltipBase = TooltipBaseFactory();

/**
 * A factory for customizing the visual style of
 * [Tooltip]{@link moonstone/TooltipDecorator.Tooltip}.
 *
 * @class TooltipFactory
 * @memberof moonstone/TooltipDecorator
 * @factory
 * @public
 */
const TooltipFactory = (props) => Skinnable(
	Uppercase(
		TooltipBaseFactory(props)
	)
);

/**
 * A tooltip component. If the Tooltip's child component is text, it will be uppercased unless
 * `casing` is set.
 *
 * @class Tooltip
 * @memberof moonstone/TooltipDecorator
 * @extends moonstone/TooltipDecorator.Tooltip
 * @mixes moonstone/Skinnable.Skinnable
 * @mixes i18n/Uppercase.Uppercase
 * @ui
 * @public
 */
const Tooltip = TooltipFactory();

export default Tooltip;
export {
	Tooltip,
	TooltipBase,
	TooltipFactory,
	TooltipBaseFactory,
	TooltipLabelFactory
};
