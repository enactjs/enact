/**
 * Provides Moonstone-themed button components and behaviors.
 *
 * @example
 * <Button small>Hello Enact!</Button>
 *
 * @module moonstone/Button
 * @exports Button
 * @exports ButtonBase
 * @exports ButtonDecorator
 */

import kind from '@enact/core/kind';
import Uppercase from '@enact/i18n/Uppercase';
import Spottable from '@enact/spotlight/Spottable';
import {ButtonBase as UiButtonBase, ButtonDecorator as UiButtonDecorator} from '@enact/ui/Button';
import ComponentCollection from '@enact/ui/internal/ComponentCollection';
import Pure from '@enact/ui/internal/Pure';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import equals from 'ramda/src/equals';
import React from 'react';

import Icon from '../Icon';
import {MarqueeDecorator} from '../Marquee';
import Skinnable from '../Skinnable';
import TooltipDecorator from '../TooltipDecorator';

import componentCss from './Button.less';

/**
 * A moonstone-styled button without any behavior.
 *
 * @class ButtonBase
 * @memberof moonstone/Button
 * @ui
 * @public
 */
const ButtonBase = kind({
	name: 'Button',

	propTypes: /** @lends moonstone/Button.ButtonBase.prototype */ {
		/**
		 * The background-color opacity of this button.
		 *
		 * Valid values are:
		 * * `'opaque'`,
		 * * `'translucent'`,
		 * * `'lightTranslucent'`, and
		 * * `'transparent'`.
		 *
		 * @type {String}
		 * @default 'opaque'
		 * @public
		 */
		backgroundOpacity: PropTypes.oneOf([
			'opaque',
			'translucent',
			'lightTranslucent',
			'transparent'
		]),

		/**
		 * The color of the underline beneath button's content. Used for `IconButton`.
		 *
		 * Accepts one of the following color names, which correspond with the colored buttons on a
		 * standard remote control: `'red'`, `'green'`, `'yellow'`, `'blue'`.
		 *
		 * @type {String}
		 * @public
		 */
		color: PropTypes.oneOf([null, 'red', 'green', 'yellow', 'blue']),

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `button` - The root class name
		 * * `bg` - The background node of the button
		 * * `selected` - Applied to a `selected` button
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * An array of data to be mapped onto the `childComponent`. This supports two data types.
		 * If an array of strings is provided, the strings will be used in the generated
		 * `childComponent` as the readable text. If an array of objects is provided, each object
		 * will be spread onto the generated `childComponent` with no interpretation. You'll be
		 * responsible for setting properties like `disabled`, `className`, and setting the text
		 * content using the `children` key.
		 *
		 * @type {String[]|Object[]}
		 * @required
		 * @public
		 */
		renderChildren: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.string),
			PropTypes.arrayOf(PropTypes.shape({
				childComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
				children: PropTypes.array,
				childProp: PropTypes.string,
				itemProps: PropTypes.object
			}))
		])
	},

	styles: {
		css: componentCss,
		publicClassNames: ['button', 'bg', 'selected']
	},

	computed: {
		className: ({backgroundOpacity, color, styler}) => styler.append(
			backgroundOpacity,
			color
		)
	},

	render: ({children, css, renderChildren, ...rest}) => {
		delete rest.backgroundOpacity;
		delete rest.color;

		const components = renderChildren && renderChildren.length ?
			<ComponentCollection>{renderChildren}</ComponentCollection> :
			children;
		return (
			<UiButtonBase
				{...rest}
				css={css}
				iconComponent={Icon}
			>
				{components}
			</UiButtonBase>
		);
	}
});

/**
 * Moonstone-specific button behaviors to apply to [Button]{@link moonstone/Button.ButtonBase}.
 *
 * @hoc
 * @memberof moonstone/Button
 * @mixes i18n/Uppercase.Uppercase
 * @mixes moonstone/TooltipDecorator.TooltipDecorator
 * @mixes moonstone/Marquee.MarqueeDecorator
 * @mixes ui/Button.ButtonDecorator
 * @mixes spotlight/Spottable.Spottable
 * @mixes ui/Skinnable.Skinnable
 * @public
 */
const ButtonDecorator = compose(
	Pure({propComparators: {renderChildren: (a, b) => equals(a, b)}}),
	Uppercase,
	TooltipDecorator,
	MarqueeDecorator({className: componentCss.marquee}),
	UiButtonDecorator,
	Spottable,
	Skinnable
);

/**
 * A Moonstone-styled button with built-in support for uppercasing, tooltips, marqueed text, and
 * Spotlight focus.
 *
 * Usage:
 * ```
 * <Button>Press me!</Button>
 * ```
 *
 * @class Button
 * @memberof moonstone/Button
 * @mixes moonstone/Button.ButtonDecorator
 * @ui
 * @public
 */
const Button = ButtonDecorator(ButtonBase);

export default Button;
export {
	Button,
	ButtonBase,
	ButtonDecorator
};
