import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';
import PropTypes from 'prop-types';

import UiIcon from '../Icon';

import componentCss from './Input.less';

/**
 * A Factory wrapper for creating Icons for use with `InputDecorator` that allows overriding certain
 * classes at design time.
 *
 * @class InputDecoratorIconBaseFactory
 * @memberof ui/Input
 * @factory
 * @private
 */
const InputDecoratorIconBaseFactory = factory({css: componentCss}, ({css}) => {
	return kind({
		name: 'InputDecoratorIcon',

		propTypes: /** @lends moonstone/Input.InputDecoratorIconBase.prototype */ {
			/**
			 * The position of the icon. Either `before` or `after`.
			 *
			 * @type {String}
			 */
			position: PropTypes.oneOf(['before', 'after']).isRequired,

			/**
			 * The icon to be displayed.
			 *
			 * @see {@link moonstone/Icon.Icon#children}
			 * @type {String|Object}
			 */
			children: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

			/**
			 * The Icon component to use as the basis for this component.
			 *
			 * @type {Component}
			 * @default {@link ui/Icon}
			 * @public
			 */
			Icon: PropTypes.oneOfType([PropTypes.func, PropTypes.element])
		},

		defaultProps: {
			Icon: UiIcon
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

		render: ({children, Icon, ...rest}) => {
			delete rest.position;

			return children ? (
				<Icon {...rest}>{children}</Icon>
			) : null;
		}
	});
});

/**
 * The stateless functional base component for {@link moonstone/Input.InputDecoratorIcon}.
 *
 * @class InputDecoratorIconBase
 * @memberof moonstone/Input
 * @ui
 * @private
 */
const InputDecoratorIconBase = InputDecoratorIconBaseFactory();

/**
 * A Factory wrapper for creating Icons for use with `InputDecorator` that allows overriding certain
 * classes at design time.
 *
 * @class InputDecoratorIconBaseFactory
 * @memberof ui/Input
 * @factory
 * @public
 */

const InputDecoratorIconFactory = (props) => onlyUpdateForKeys(['children'])(InputDecoratorIconBaseFactory(props));

/**
 * An icon displayed either before or after the input field of an {@link moonstone/Input.Input}.
 *
 * @class InputDecoratorIcon
 * @memberof moonstone/Input
 * @ui
 * @private
 */
const InputDecoratorIcon = InputDecoratorIconFactory();

export default InputDecoratorIconBase;
export {
	InputDecoratorIcon,
	InputDecoratorIconBase,
	InputDecoratorIconFactory,
	InputDecoratorIconBaseFactory
};
