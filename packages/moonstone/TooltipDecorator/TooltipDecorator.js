/**
 * A Higher-order Component which positions a `Tooltip` relative to a wrapped component and the
 * `Tooltip` component.
 *
 * @module moonstone/TooltipDecorator
 * @exports TooltipDecorator
 * @exports Tooltip
 * @exports TooltipBase
 * @exports TooltipFactory
 */

import hoc from '@enact/core/hoc';
import UiTooltipDecorator from '@enact/ui/TooltipDecorator';
import React from 'react';

import {Tooltip, TooltipBase, TooltipFactory} from './Tooltip';

/**
 * {@link moonstone/TooltipDecorator.TooltipDecorator} is a Higher-order Component which
 * positions {@link moonstone/TooltipDecorator.Tooltip} in relation to the
 * Wrapped component.
 * The tooltip is automatically displayed when the user hovers over the decorator for
 * a given period of time. The tooltip is positioned around the decorator where there
 * is available window space.
 *
 * Note that the direction of tooltip will be flipped horizontally in RTL locales.
 *
 * @class TooltipDecorator
 * @memberof moonstone/TooltipDecorator
 * @extends ui/TooltipDecorator.TooltipDecorator
 * @hoc
 * @public
 */
const TooltipDecoratorBase = hoc((config, Wrapped) => {
	return class extends React.Component {
		static displayName = 'MoonstoneTooltipDecorator'

		render () {
			return (
				<Wrapped {...this.props} Tooltip={Tooltip} />
			);
		}
	};
});

const TooltipDecorator = (props) => TooltipDecoratorBase(UiTooltipDecorator(props));

export default TooltipDecorator;
export {TooltipDecorator, Tooltip, TooltipBase, TooltipFactory};
