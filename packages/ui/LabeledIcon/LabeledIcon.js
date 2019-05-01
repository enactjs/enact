/**
 * Provides unstyled LabeledIcon components to be customized by a theme or application.
 *
 * @module ui/LabeledIcon
 * @exports LabeledIcon
 * @exports LabeledIconBase
 * @exports LabeledIconDecorator
 */

import kind from '@enact/core/kind';
import deprecate from '@enact/core/internal/deprecate';
import EnactPropTypes from '@enact/core/internal/prop-types';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import ComponentOverride from '../ComponentOverride';
import {CellBase, LayoutBase} from '../Layout';
import Slottable from '../Slottable';

import componentCss from './LabeledIcon.module.less';

const deprecateSmall = deprecate((small) => small ? 'small' : 'large',  {
	name: 'ui/LabeledIcon.LabeledIconBase#small',
	replacedBy: 'the `size` prop',
	message: 'Use `size="small"` instead.',
	since: '2.6.0',
	until: '3.0.0'
});

function getSize (size, small) {
	small = typeof small !== 'undefined' ? deprecateSmall(small) : 'large';
	return size || small;
}

/**
 * An icon component with a label.
 *
 * @class LabeledIconBase
 * @memberof ui/LabeledIcon
 * @ui
 * @public
 */
const LabeledIconBase = kind({
	name: 'ui:LabeledIcon',

	propTypes: /** @lends ui/LabeledIcon.LabeledIconBase.prototype */ {
		/**
		 * The label.
		 *
		 * This accepts strings, DOM, and Components, if you need more elaborate features. It may be
		 * positioned using `labelPosition`.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `labeledIcon` - The root component class
		 * * `icon` - The icon component class
		 * * `iconCell` - Applied to the `iconComponent` directly, like `.icon`. If `icon` in a
		 *                React component, this class is applied to the container of the icon,
		 *                rather than the icon itself.
		 * * `label` - The label component class
		 * * `inline` - Applied when the inline prop is set
		 * * `above` - Applied when the labelPosition prop is set to above
		 * * `after` - Applied when the labelPosition prop is set to after
		 * * `before` - Applied when the labelPosition prop is set to before
		 * * `below` - Applied when the labelPosition prop is set to below
		 * * `left` - Applied when the labelPosition prop is set to left
		 * * `right` - Applied when the labelPosition prop is set to right
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Disables the component and becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * The icon.
		 *
		 * This will be passed as `children` to the `iconComponent`, unless you supply a React
		 * element (like JSX) to this prop, directly or via the `<icon>` slot.
		 *
		 * @type {String|Element|Component}
		 * @public
		 */
		icon: EnactPropTypes.renderableOverride,

		/**
		 * The component used to render the `icon`.
		 *
		 * This will receive the `icon` prop as `children` and should handle it appropriately. This
		 * prop is ignored in the case of a component being passed into the `icon` prop. It will
		 * also receive the `size` prop as set on the component.
		 *
		 * @type {Component}
		 */
		iconComponent: EnactPropTypes.component,

		/**
		 * Enables this component to be used in an "inline" context.
		 *
		 * This is useful for when you have several of these components in a row and are not using a
		 * [Layout]{@link ui/Layout} or flex-box configuration.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		inline: PropTypes.bool,

		/**
		 * The position of the label in relation to the icon element.
		 *
		 * Allowed values include:
		 * * 'below' (default),
		 * * 'above',
		 * * 'left',
		 * * 'right',
		 * * 'before', and
		 * * 'after'.
		 *
		 * The 'before' and 'after' values automatically swap sides when in an RTL locale context.
		 *
		 * @type {String}
		 * @default 'below'
		 * @public
		 */
		labelPosition: PropTypes.oneOf(['above', 'after', 'before', 'below', 'left', 'right']),

		/**
		 * The size of the icon.
		 *
		 * Applies either the `small` or `large` CSS class which can be customized by
		 * [theming]{@link /docs/developer-guide/theming/}.
		 *
		 * @type {String}
		 * @default 'large'
		 * @public
		 */
		size: PropTypes.string,

		/**
		 * Reduces the size of the icon component.
		 *
		 * The value of `small` is forwarded on to `iconComponent`.
		 *
		 * @type {Boolean}
		 * @default false
		 * @deprecated replaced by prop `size='small'`
		 * @public
		 */
		small: PropTypes.bool
	},

	defaultProps: {
		labelPosition: 'below',
		inline: false
		// size: 'large', // we won't set default props for `size` yet to support `small` prop
	},

	styles: {
		css: componentCss,
		className: 'labeledIcon',
		publicClassNames: true
	},

	computed: {
		className: ({inline, labelPosition, styler}) => styler.append(labelPosition, {inline}),
		orientation: ({labelPosition}) => {
			const vertical = labelPosition === 'above' || labelPosition === 'below';
			return vertical ? 'vertical' : 'horizontal';
		}
	},

	render: ({css, children, disabled, icon, iconComponent: Icon, orientation, size, small, ...rest}) => {
		delete rest.inline;

		let iconClassName = css.icon;
		size = getSize(size, small);

		// Rearrange the props to support custom JSX components
		// `icon` is normally passed to `iconComponent` as children, but if `icon` is instead a
		// rendered JSX component, it should become a child of `Cell.icon` and iconComponent should
		// use Cell's default value. We must also reposition the `icon` class
		if (React.isValidElement(icon)) {
			icon = ComponentOverride({
				component: icon,
				className: iconClassName,
				disabled,
				size
			});
			// Removing size and iconComponent from CellBase
			// eslint-disable-next-line no-undefined
			size = Icon = undefined;
			iconClassName = null;
		}

		delete rest.inline;
		delete rest.labelPosition;

		return LayoutBase.inline({
			...rest,
			align: 'center center',
			disabled,
			orientation,
			children: [
				CellBase.inline({
					key: 'icon',
					shrink: true,
					size: '100%',
					className: css.iconCell,
					children: Icon ?
						<Icon
							className={iconClassName}
							disabled={disabled}
							size={size}
						>
							{icon}
						</Icon> : icon
				}),
				CellBase.inline({
					key: 'label',
					shrink: true,
					component: 'label',
					className: css.label,
					disabled,
					children
				})
			]
		});
	}
});

/**
 * A higher-order component that adds [slot]{@link ui/Slottable.Slottable} support to [LabeledIconBase]{@link ui/LabeledIcon.LabeledIconBase}
 *
 * @hoc
 * @memberof ui/LabeledIcon
 * @mixes ui/Slottable.Slottable
 * @public
 */
const LabeledIconDecorator = compose(
	Slottable({slots: ['icon']})
);

/**
 * An icon component with a label without any behaviors applied to it.
 *
 * Usage:
 * ```
 * <LabeledIcon icon="star" labelPosition="after">
 *   Favorite
 * </LabeledIcon>
 * ```
 *
 * @class LabeledIcon
 * @memberof ui/LabeledIcon
 * @extends ui/LabeledIcon.LabeledIconBase
 * @mixes ui/LabeledIcon.LabeledIconDecorator
 * @ui
 * @public
 */
const LabeledIcon = LabeledIconDecorator(LabeledIconBase);

export default LabeledIcon;
export {
	LabeledIcon,
	LabeledIconBase,
	LabeledIconDecorator
};
