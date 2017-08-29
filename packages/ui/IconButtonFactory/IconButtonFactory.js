/**
 * Exports the {@link ui/IconButtonFactory.IconButtonFactory} factory.
 *
 * @module ui/IconButtonFactory
 */

import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';
import PropTypes from 'prop-types';

import ButtonFactory from '../ButtonFactory';
import IconFactory from '../IconFactory';

import componentCss from './IconButtonFactory.less';

const OnlyUpdate = onlyUpdateForKeys(['small', 'children']);

/**
 * The Factory generates the most basic form of the component allowing its consumer to overriding
 * certain classes at design time.
 * The following are properties of the `css` member of the argument to the factory.
 *
 * Using Factory to create a custom styled component:
 * ```
 * import css from './CustomIconButton.less';
 * import IconButtonFactory from '@enact/ui/IconButtonFactory';
 * const IconButton = IconButtonFactory({
 *     css: {
 *         bg: css.bg,
 *         selected: css.selected
 *     }
 * });
 * ```
 *
 * @class IconButtonFactory
 * @memberof ui/IconButtonFactory
 * @factory
 * @public
 */
const IconButtonFactory = factory({css: componentCss}, (config) => {
	const {css} = config;

	const UiButton = ButtonFactory({css});
	const UiIcon = OnlyUpdate(
		IconFactory(config)
	);

	return kind({
		name: 'IconButton',

		propTypes: /** @lends ui/IconButtonFactory.IconButtonFactory.prototype */ {
			/**
			 * The background-color opacity of this icon button; valid values are `'opaque'`,
			 * `'translucent'`, and `'transparent'`.
			 *
			 * @type {String}
			 * @default 'opaque'
			 * @public
			 */
			backgroundOpacity: PropTypes.oneOf(['opaque', 'translucent', 'transparent']),

			/**
			 * The Button component to use as the basis for this Button.
			 *
			 * @type {Component}
			 * @default Button Component
			 * @public
			 */
			Button: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),

			/**
			 * The icon displayed within the button.
			 *
			 * @see {@link ui/Icon.Icon#children}
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
			 * The Icon component to use in this IconButton.
			 *
			 * @type {Component}
			 * @default {@link ui/Icon}
			 * @public
			 */
			Icon: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),

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
			small: PropTypes.bool
		},

		defaultProps: {
			Button: UiButton,
			Icon: UiIcon,
			small: false
		},

		styles: {
			css,
			className: 'iconButton'
		},

		computed: {
			className: ({color, small, styler}) => styler.append({small}, color)
		},

		render: ({Button, children, Icon, small, ...rest}) => {
			return (
				<Button {...rest} small={small} minWidth={false} marqueeDisabled>
					<Icon small={small} className={css.icon}>{children}</Icon>
				</Button>
			);
		}
	});
});

export default IconButtonFactory;
export {
	IconButtonFactory
};
