/**
 * An {@link moonstone/Icon.Icon} that acts like a button.
 *
 * @module moonstone/IconButton
 * @exports IconButton
 * @exports IconButtonBase
 * @exports IconButtonBaseFactory
 * @exports IconButtonFactory
 */

import compose from 'ramda/src/compose';
import kind from '@enact/core/kind';
import Spottable from '@enact/spotlight/Spottable';
import Pure from '@enact/ui/internal/Pure';
import React from 'react';
import PropTypes from 'prop-types';

import {ButtonBase} from '../Button';
import Icon from '../Icon';
import {TooltipDecorator} from '../TooltipDecorator';
import Skinnable from '../Skinnable';
import Touchable from '../internal/Touchable';

import componentCss from './IconButton.less';

const IconButtonBase = kind({
	name: 'IconButton',

	propTypes: /** @lends moonstone/IconButton.IconButtonBase.prototype */ {
		/**
		 * The background-color opacity of this icon button; valid values are `'opaque'`,
		 * `'translucent'`, `'lightTranslucent'`, and `'transparent'`.
		 *
		 * @type {String}
		 * @default 'opaque'
		 * @public
		 */
		backgroundOpacity: PropTypes.oneOf(['opaque', 'translucent', 'lightTranslucent', 'transparent']),

		/**
		 * The icon displayed within the button.
		 *
		 * @see {@link moonstone/Icon.Icon#children}
		 * @type {String|Object}
		 * @public
		 */
		children: PropTypes.string,

		/**
		 * This property accepts one of the following color names, which correspond with the
		 * colored buttons on a standard remote control: `'red'`, `'green'`, `'yellow'`, `'blue'`
		 *
		 * @type {String}
		 * @public
		 */
		color: PropTypes.oneOf([null, 'red', 'green', 'yellow', 'blue']),

		/**
		 * When `true`, the [button]{@glossary button} is shown as disabled and does not
		 * generate `onClick` [events]{@glossary event}.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * When `true`, the button does not animate on press. Note that the default value
		 * will change to `false` in 2.0.0
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		noAnimation: PropTypes.bool,

		/**
		 * When `true`, a pressed visual effect is applied to the icon button
		 *
		 * @type {Boolean}
		 * @public
		 */
		pressed: PropTypes.bool,

		/**
		 * When `true`, a selected visual effect is applied to the icon button
		 *
		 * @type {Boolean}
		 * @public
		 */
		selected: PropTypes.bool,

		/**
		 * A boolean parameter affecting the size of the button. If `true`, the
		 * button's diameter will be set to 60px. However, the button's tap target
		 * will still have a diameter of 78px, with an invisible DOM element
		 * wrapping the small button to provide the larger tap zone.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		small: PropTypes.bool,

		/**
		 * An optional node to receive the tooltip from `TooltipDecorator`.
		 *
		 * @type {Node}
		 * @private
		 */
		tooltipNode: PropTypes.node
	},

	defaultProps: {
		noAnimation: true,
		small: false
	},

	styles: {
		css: componentCss,
		className: 'iconButton'
	},

	computed: {
		className: ({color, small, styler}) => styler.append({small}, color)
	},

	render: ({children, css, small, tooltipNode, ...rest}) => {
		return (
			<ButtonBase {...rest} small={small} minWidth={false}>
				<Icon small={small} className={css.icon}>{children}</Icon>
				{tooltipNode}
			</ButtonBase>
		);
	}
});

const IconButtonDecorator = compose(
	Pure,
	TooltipDecorator({tooltipDestinationProp: 'tooltipNode'}),
	Touchable,
	Spottable,
	Skinnable
);

/**
 * An {@link moonstone/Icon.Icon} that acts like a button.  You may specify an image or a font-based
 * icon by setting the children to either the path to the image or a string from the
 * [IconList]{@link moonstone/Icon.IconList}. `IconButton` does not have `Marquee` or `Uppercase`
 * like `Button` has, as it should not contain text.
 *
 * Usage:
 * ```
 * <IconButton onClick={handleClick} small>
 *     plus
 * </IconButton>
 * ```
 *
 * @class IconButton
 * @memberof moonstone/IconButton
 * @extends moonstone/IconButton.IconButtonBase
 * @mixes moonstone/TooltipDecorator.TooltipDecorator
 * @mixes ui/Touchable.Touchable
 * @mixes spotlight/Spottable.Spottable
 * @ui
 * @public
 */
const IconButton = IconButtonDecorator(IconButtonBase);

export default IconButton;
export {
	IconButton,
	IconButtonBase,
	IconButtonDecorator
};
