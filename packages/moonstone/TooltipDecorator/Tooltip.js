/**
 * Exports the {@link moonstone/Tooltip.Tooltip} and {@link moonstone/Tooltip.TooltipBase}
 * components.  The default export is {@link moonstone/Tooltip.TooltipBase}.
 *
 * @module moonstone/Tooltip
 */

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
 * {@link moonstone/TooltipDecorator.TooltipBase} is a stateless tooltip component with
 * Moonston styling applied.
 *
 * @class TooltipBase
 * @memberof moonstone/TooltipDecorator
 * @ui
 * @public
 */
const TooltipBaseFactory = factory({css: componentCss}, ({css}) => {
	// diffClasses('Moon Tooltip', componentCss, css);

	const UiTooltip = UiTooltipFactory({
		/* Replace classes in this step */
		css: /** @lends moonstone/TooltipBase.TooltipFactory.prototype */ {
			...componentCss,
			// Include the component class name so it too may be overridden.
			tooltip: css.tooltip
		}
	});
	const TooltipLabel = TooltipLabelFactory({css});

	/**
	 * {@link moonstone/TooltipDecorator.TooltipBase} is a stateless tooltip component with
	 * Moonstone styling applied.
	 *
	 * @class TooltipBase
	 * @memberof moonstone/TooltipDecorator
	 * @ui
	 * @public
	 */
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

const TooltipBase = TooltipBaseFactory();

/**
 * {@link moonstone/TooltipDecorator.Tooltip} is a tooltip component with Moonstone styling
 * applied. If the Tooltip's child component is text, it will be uppercased unless
 * `casing` is set.
 *
 * @class Tooltip
 * @memberof moonstone/TooltipDecorator
 * @mixes i18n/Uppercase.Uppercase
 * @ui
 * @public
 */
const Tooltip = Skinnable(
	Uppercase(
		TooltipBase
	)
);

const TooltipFactory = (props) => Skinnable(
	Uppercase(
		TooltipBaseFactory(props)
	)
);

export default Tooltip;
export {
	Tooltip,
	TooltipBase,
	TooltipFactory,
	TooltipBaseFactory,
	TooltipLabelFactory
};
