import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import UiIcon from '../Icon';

import componentCss from './ToggleItem.less';

/**
 * {@link ui/ToggleIcon.ToggleIconBaseFactory} is Factory wrapper around
 * {@link ui/ToggleIcon.ToggleIconBase} that allows overriding certain classes at design time. The
 * following are properties of the `css` member of the argument to the factory.
 *
 * @class ToggleIconBaseFactory
 * @memberof ui/ToggleIcon
 * @factory
 * @ui
 * @public
 */
const ToggleIconBaseFactory = factory({css: componentCss}, ({css}) => {
	/**
	 * Utility component to render the {@link moonstone/Icon.Icon} for
	 * {@link moonstone/ToggleItem.ToggleItem}.
	 *
	 * @class ToggleIcon
	 * @memberof moonstone/ToggleItem
	 * @ui
	 * @private
	 */
	return kind({
		name: 'ToggleIcon',

		propTypes: /** @lends moonstone/ToggleItem.ToggleIcon.prototype */ {
			/**
			 * Nothing, a string, or an {@link moonstone/Icon.Icon}
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

const ToggleIconBase = ToggleIconBaseFactory();

export default ToggleIconBase;
export {
	ToggleIconBase as ToggleIcon,
	ToggleIconBase,
	ToggleIconBaseFactory as ToggleIconFactory,
	ToggleIconBaseFactory
};
