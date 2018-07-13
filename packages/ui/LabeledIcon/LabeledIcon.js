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
import Layout, {Cell} from '../Layout';

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
		 * The LabeledIcon content.
		 *
		 * May be specified as either:
		 *
		 * * A string that represents an LabeledIcon from the [LabeledIconList]{@link ui/LabeledIcon.LabeledIconBase.LabeledIconList},
		 * * An HTML entity string, Unicode reference or hex value (in the form '0x...'),
		 * * A URL specifying path to an LabeledIcon image, or
		 * * An object representing a resolution independent resource (See {@link ui/resolution}).
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
		 * * `label` - The label component class
		 * * `icon` - The icon component class
		 *
		 * @type {Object}
		 * @public
		 */
		css: PropTypes.object,

		/**
		 * Disables the [LabeledIconBase]{@link ui/LabeledIcon.LabeledIconBase}
		 *
		 * When `true`, the LabeledIcon is shown as disabled and does not respond to
		 * `onClick` [events]{@link /docs/developer-guide/glossary/#event}.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		iconComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
		labelPosition: PropTypes.oneOf(['above', 'after', 'before', 'below', 'left', 'right'])
	},

	defaultProps: {
		// iconComponent: 'div',
		labelPosition: 'below'
	},

	styles: {
		css: componentCss,
		className: 'labeledIcon',
		publicClassNames: true
	},

	computed: {
		className: ({labelPosition, styler}) => styler.append(labelPosition),
		orientation: ({labelPosition}) => (labelPosition === 'above' || labelPosition === 'below') ? 'vertical' : 'horizontal'
	},

	render: ({css, children, className, disabled, icon, iconComponent, orientation, style, ...rest}) => {
		let iconClassName = css.icon;

		// Rearrange the props to support custom JSX components
		// `icon` is normally passed to `iconComponent` as children, but if `icon` is instead a
		// rendered JSX component, it should become a child of `Cell.icon` and iconComponent should
		// use Cell's default value. We must also reposition the `icon` class
		if (React.isValidElement(icon)) {
			icon = <ComponentOverride
				component={icon}
				className={iconClassName}
				disabled={disabled}
			/>;
			iconComponent = void 0;
			iconClassName = null;
		}

		delete rest.labelPosition;

		return (
			<Layout
				align="center center"
				className={className}
				disabled={disabled}
				orientation={orientation}
				style={style}
			>
				<Cell
					shrink
					size="100%"
					{...rest}
					component={iconComponent}
					className={css.iconCell + ' ' + iconClassName}
					disabled={disabled}
				>
					{icon}
				</Cell>
				<Cell
					shrink
					component="label"
					className={css.label}
					disabled={disabled}
				>
					{children}
				</Cell>
			</Layout>
		);
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
