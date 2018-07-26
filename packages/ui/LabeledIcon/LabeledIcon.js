/**
 * Provides unstyled LabeledIcon components to be customized by a theme or application.
 *
 * @module ui/LabeledIcon
 * @exports LabeledIcon
 */

import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';
import compose from 'ramda/src/compose';

import ComponentOverride from '../ComponentOverride';
import Slottable from '../Slottable';
import {CellBase, LayoutBase} from '../Layout';

import componentCss from './LabeledIcon.less';

/**
 * A basic LabeledIcon component structure without any behaviors applied to it.
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
		 * The readable label. This accepts strings, DOM, and Components, if you need more elaborate
		 * features.
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
		 * Disables the [LabeledIconBase]{@link ui/LabeledIcon.LabeledIconBase}
		 *
		 * When `true`, the LabeledIcon is shown as disabled.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * The icon content. This will be passed as `children` to the `iconComponent`, unless you
		 * supply a React element (like JSX) to this prop, directly or via the `<icon>` slot.
		 *
		 * @type {String|Object|Component}
		 */
		icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func]),

		/**
		 * The component used to render the `icon`. This will receive the `icon` prop as `children`
		 * and should handle it appropriately. This prop is ignored in the case of a component being
		 * passed into the `icon` prop.
		 *
		 * @type {String|Component}
		 */
		iconComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

		/**
		 * Enable this component to be used in an "inline" context. This is useful for when you have
		 * several of these components in a row and are not using a [Layout]{@link ui/Layout} or
		 * flex-box configuration.
		 *
		 * @type {Boolean}
		 */
		inline: PropTypes.bool,

		/**
		 * Assigns where the label will be positioned in relation to the icon element. The supported
		 * options are 'below' (default), 'above', 'left', 'right', 'before', and 'after'. The
		 * 'before' and 'after' values automatically swap sides when in an RTL locale context.
		 *
		 * @type {String}
		 */
		labelPosition: PropTypes.oneOf(['above', 'after', 'before', 'below', 'left', 'right'])
	},

	defaultProps: {
		labelPosition: 'below',
		inline: false
	},

	styles: {
		css: componentCss,
		className: 'labeledIcon',
		publicClassNames: true
	},

	computed: {
		className: ({inline, labelPosition, styler}) => styler.append(labelPosition, {inline}),
		orientation: ({labelPosition}) => (labelPosition === 'above' || labelPosition === 'below') ? 'vertical' : 'horizontal'
	},

	render: ({css, children, className, disabled, icon, iconComponent, orientation, style, ...rest}) => {
		let iconClassName = css.icon;

		// Rearrange the props to support custom JSX components
		// `icon` is normally passed to `iconComponent` as children, but if `icon` is instead a
		// rendered JSX component, it should become a child of `Cell.icon` and iconComponent should
		// use Cell's default value. We must also reposition the `icon` class
		if (React.isValidElement(icon)) {
			icon = ComponentOverride({
				component: icon,
				className: iconClassName,
				disabled
			});
			iconComponent = void 0;
			iconClassName = null;
		}

		delete rest.inline;
		delete rest.labelPosition;

		return LayoutBase.inline({
			align: 'center center',
			className,
			disabled,
			orientation,
			style,
			children: [
				CellBase.inline({
					key: 'icon',
					shrink: true,
					size: '100%',
					...rest,
					component: iconComponent,
					className: (css.iconCell + ' ' + iconClassName),
					disabled,
					children: icon
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

const LabeledIconDecorator = compose(
	Slottable({slots: ['icon']})
);

const LabeledIcon = LabeledIconDecorator(LabeledIconBase);

export default LabeledIcon;
export {
	LabeledIcon,
	LabeledIconBase,
	LabeledIconDecorator
};
