/**
 * Moonstone styled labeled divider components and behaviors
 *
 * @example
 * <Divider
 *   casing="preserve"
 *   spacing="medium"
 * >
 *   A group of related components
 * </Divider>
 *
 * @module moonstone/Divider
 * @exports Divider
 * @exports DividerBase
 * @exports DividerDecorator
 */

import kind from '@enact/core/kind';
import deprecate from '@enact/core/internal/deprecate';
import React from 'react';

import {HeadingBase, HeadingDecorator} from '../Heading';

/**
 * A labeled divider component.
 *
 * This component is most often not used directly but may be composed within another component as it
 * is within [Divider]{@link moonstone/Divider.Divider}.
 *
 * @class DividerBase
 * @memberof moonstone/Divider
 * @ui
 * @public
 */
const DividerBase = kind({
	name: 'Divider',
	render: (props) => {
		deprecate({
			name: 'moonstone/Divider',
			replacedBy: 'moonstone/Heading',
			message: 'Use `showLine` to enable the same under line as Divider',
			since: '2.6.0',
			until: '3.0.0'
		});
		return <HeadingBase {...props} showLine size="medium" />;
	}
});


/**
 * Applies Moonstone specific behaviors to [DividerBase]{@link moonstone/Divider.DividerBase}.
 *
 * @name DividerDecorator
 * @class
 * @hoc
 * @memberof moonstone/Divider
 * @mixes i18n/Uppercase.Uppercase
 * @mixes moonstone/Marquee.MarqueeDecorator
 * @mixes moonstone/Skinnable.Skinnable
 * @public
 */


/**
 * A labeled divider component, ready to use in Moonstone applications.
 *
 * `Divider` may be used as a header to group related components.
 *
 * Usage:
 * ```
 * <Divider
 *   casing="preserve"
 *   spacing="medium"
 * >
 *   Related Settings
 * </Divider>
 * <CheckboxItem>A Setting</CheckboxItem>
 * <CheckboxItem>A Second Setting</CheckboxItem>
 * ```
 *
 * @class Divider
 * @memberof moonstone/Divider
 * @extends moonstone/Divider.DividerBase
 * @mixes moonstone/Divider.DividerDecorator
 * @ui
 * @public
 */
const Divider = HeadingDecorator(DividerBase);

/**
 * The casing mode applied to the `children` text.
 *
 * @name casing
 * @type {String}
 * @default 'word'
 * @memberof moonstone/Divider.Divider.prototype
 * @see i18n/Uppercase#casing
 * @public
 */

/**
 * Marquee animation trigger.
 *
 * Allowed values include:
 * * `'hover'` - Marquee begins when the pointer enters the component
 * * `'render'` - Marquee begins when the component is rendered
 *
 * @name marqueeOn
 * @type {String}
 * @default 'render'
 * @memberof moonstone/Divider.Divider.prototype
 * @see moonstone/Marquee.Marquee
 * @public
 */

export default Divider;
export {
	Divider,
	DividerBase,
	HeadingDecorator as DividerDecorator
};
