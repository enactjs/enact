import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import UiIcon from '../Icon';

import componentCss from './ToggleItem.less';

/**
 * A factory for customizing the visual style of [ToggleIconBase]{@link ui/ToggleItem.ToggleIconBase}.
 *
 * @class ToggleIconBaseFactory
 * @memberof ui/ToggleItem
 * @factory
 * @public
 */
const ToggleIconBaseFactory = factory({css: componentCss}, ({css}) => {
	return kind({
		name: 'ToggleIcon',

		propTypes: /** @lends ui/ToggleItem.ToggleIconBase.prototype */ {
			/**
			 * Nothing, a string, or an {@link ui/Icon.Icon}
			 *
			 * @type {Node}
			 */
			children: PropTypes.node,

			/**
			 * The Icon component to use as the base of this component.
			 *
			 * @type {Component}
			 * @default {@link ui/Icon}
			 * @public
			 */
			Icon: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),

			/**
			 * When `true`, the icon is displayed
			 *
			 * @type {Boolean}
			 */
			selected: PropTypes.bool
		},

		defaultProps: {
			Icon: UiIcon,
			selected: false
		},

		styles: {
			css,
			className: 'icon'
		},

		computed: {
			className: ({selected, styler}) => styler.append({selected})
		},

		render: ({children, Icon, ...rest}) => {
			if (children) {
				if (React.isValidElement(children)) {
					return children;
				}
				return (
					<Icon {...rest}>{children}</Icon>
				);
			}

			return null;
		}
	});
});

/**
 * A stateless [ToggleIcon]{@link ui/ToggleItem.ToggleIcon}, with no HOCs applied.
 *
 * @class ToggleIconBase
 * @memberof ui/ToggleItem
 * @ui
 * @public
 */
const ToggleIconBase = ToggleIconBaseFactory();

/**
 * A factory for customizing the visual style of [ToggleIcon]{@link ui/ToggleItem.ToggleIcon}.
 * @see {@link ui/ToggleItem.ToggleIconBaseFactory}.
 *
 * @class ToggleIconFactory
 * @memberof ui/ToggleItem
 * @factory
 * @public
 */

/**
 * An empty icon for use specifically with [ToggleItem]{@link ui/ToggleItem}.
 *
 * @class ToggleIcon
 * @memberof ui/ToggleItem
 * @extends ui/ToggleItem.ToggleIconBase
 * @ui
 * @public
 */

export default ToggleIconBase;
export {
	ToggleIconBase as ToggleIcon,
	ToggleIconBase,
	ToggleIconBaseFactory as ToggleIconFactory,
	ToggleIconBaseFactory
};
