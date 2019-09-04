import kind from '@enact/core/kind';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';
import PropTypes from 'prop-types';

import Icon from '../Icon';

import css from './Input.module.less';

/**
 * The stateless functional base component for {@link moonstone/Input.InputDecoratorIcon}.
 *
 * @class InputDecoratorIconBase
 * @memberof moonstone/Input
 * @ui
 * @private
 */
const InputDecoratorIconBase = kind({
	name: 'InputDecoratorIcon',

	propTypes: /** @lends moonstone/Input.InputDecoratorIconBase.prototype */ {
		/**
		 * The position of the icon. Either `before` or `after`.
		 *
		 * @type {String}
		 * @required
		 */
		position: PropTypes.oneOf(['before', 'after']).isRequired,

		/**
		 * The icon to be displayed.
		 *
		 * @see {@link moonstone/Icon.Icon#children}
		 * @type {String|Object}
		 */
		children: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
	},

	styles: {
		css,
		className: 'decoratorIcon'
	},

	computed: {
		className: ({position, styler}) => {
			return styler.append('icon' + (position === 'before' ? 'Before' : 'After'));
		}
	},

	render: ({children, ...rest}) => {
		delete rest.position;

		return children ? (
			<Icon {...rest}>{children}</Icon>
		) : null;
	}
});

/**
 * An icon displayed either before or after the input field of an {@link moonstone/Input.Input}.
 *
 * @class InputDecoratorIcon
 * @memberof moonstone/Input
 * @ui
 * @private
 */
const InputDecoratorIcon = onlyUpdateForKeys(['children', 'small'])(InputDecoratorIconBase);

export default InputDecoratorIcon;
export {
	InputDecoratorIcon,
	InputDecoratorIconBase
};
