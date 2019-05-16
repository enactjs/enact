/**
 * Moonstone styled labeled Heading components and behaviors
 *
 * @example
 * <Heading
 *   casing="preserve"
 *   size="large"
 *   spacing="small"
 * >
 *   A Content Section Heading
 * </Heading>
 *
 * @module moonstone/Heading
 * @exports Heading
 * @exports HeadingBase
 * @exports HeadingDecorator
 */

import kind from '@enact/core/kind';
import Uppercase from '@enact/i18n/Uppercase';
import Pure from '@enact/ui/internal/Pure';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import defaultProps from 'recompose/defaultProps';
import setPropTypes from 'recompose/setPropTypes';
import UiHeading from '@enact/ui/Heading';

import {MarqueeDecorator} from '../Marquee';
import Skinnable from '../Skinnable';

import componentCss from './Heading.module.less';

/**
 * A labeled Heading component.
 *
 * This component is most often not used directly but may be composed within another component as it
 * is within [Heading]{@link moonstone/Heading.Heading}.
 *
 * @class HeadingBase
 * @memberof moonstone/Heading
 * @ui
 * @public
 */
const HeadingBase = kind({
	name: 'Heading',

	propTypes: /** @lends moonstone/Heading.HeadingBase.prototype */ {
		css: PropTypes.object,

		/**
		 * Adds a horizontal-rule (line) under the component
		 *
		 * @type {Boolean}
		 * @public
		 */
		showLine: PropTypes.bool
	},

	styles: {
		css: componentCss,
		className: 'heading'
	},

	computed: {
		className: ({showLine, styler}) => styler.append({showLine})
	},

	render: ({css, ...rest}) => {
		delete rest.showLine;
		return UiHeading.inline({css, ...rest});
	}
});

/**
 * Applies Moonstone specific behaviors to [HeadingBase]{@link moonstone/Heading.HeadingBase}.
 *
 * @hoc
 * @memberof moonstone/Heading
 * @mixes i18n/Uppercase.Uppercase
 * @mixes moonstone/Marquee.MarqueeDecorator
 * @mixes moonstone/Skinnable.Skinnable
 * @public
 */
const HeadingDecorator = compose(
	setPropTypes({
		marqueeOn: PropTypes.oneOf(['hover', 'render'])
	}),
	defaultProps({
		casing: 'word',
		marqueeOn: 'render'
	}),
	Pure,
	Uppercase,
	MarqueeDecorator,
	Skinnable
);

/**
 * A labeled Heading component, ready to use in Moonstone applications.
 *
 * `Heading` may be used as a header to group related components.
 *
 * Usage:
 * ```
 * <Heading
 *   casing="preserve"
 *   spacing="medium"
 * >
 *   Related Settings
 * </Heading>
 * <CheckboxItem>A Setting</CheckboxItem>
 * <CheckboxItem>A Second Setting</CheckboxItem>
 * ```
 *
 * @class Heading
 * @memberof moonstone/Heading
 * @extends moonstone/Heading.HeadingBase
 * @mixes moonstone/Heading.HeadingDecorator
 * @ui
 * @public
 */
const Heading = HeadingDecorator(HeadingBase);

/**
 * The casing mode applied to the `children` text.
 *
 * @name casing
 * @type {String}
 * @default 'word'
 * @memberof moonstone/Heading.Heading.prototype
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
 * @memberof moonstone/Heading.Heading.prototype
 * @see moonstone/Marquee.Marquee
 * @public
 */

export default Heading;
export {
	Heading,
	HeadingBase,
	HeadingDecorator
};
