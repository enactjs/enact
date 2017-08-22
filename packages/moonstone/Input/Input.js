/**
 * An input component.
 *
 * @example
 * <Input iconBefore="star" placholder="Enter something" />
 *
 * @module moonstone/Input
 */

import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import {InputFactory as UiInputFactory} from '@enact/ui/Input';

import $L from '../internal/$L';

import Skinnable from '../Skinnable';
import {Tooltip} from '../TooltipDecorator';

import {InputDecoratorIconFactory} from './InputDecoratorIcon';
import InputSpotlightDecorator from './InputSpotlightDecorator';

import componentCss from './Input.less';


const calcAriaLabel = function (title, type, value = '') {
	const hint = $L('input field');

	if (type === 'password' && value) {
		const character = value.length > 1 ? $L('characters') : $L('character');
		value = `${value.length} ${character}`;
	}

	return `${title} ${value} ${hint}`;
};

/**
 * A factory for customizing the visual style of [InputBase]{@link moonstone/Input.InputBase}.
 *
 * @class InputBaseFactory
 * @memberof moonstone/Input
 * @factory
 * @public
 */
const InputBaseFactory = factory({css: componentCss}, ({css}) => {
	// diffClasses('Moon IconButton', componentCss, css);

	const UiInput = UiInputFactory({
		/* Replace classes in this step */
		css: /** @lends moonstone/Input.InputBaseFactory.prototype */ {
			...componentCss,
			// Include the component class name so it too may be overridden.
			input: css.input
		}
	});
	const InputDecoratorIcon = InputDecoratorIconFactory({css});

	return kind({
		name: 'MoonstoneInput',

		propTypes: /** @lends moonstone/Input.InputBase.prototype */ {
			/**
			 * The tooltip text to be displayed when the contents of the input are invalid. If this value is
			 * falsy, the tooltip will not be shown.
			 *
			 * @type {String}
			 * @default ''
			 * @public
			 */
			invalidMessage: PropTypes.string,

			/**
			 * The placeholder text to display.
			 *
			 * @type {String}
			 * @default ''
			 * @public
			 */
			placeholder: PropTypes.string,

			/**
			 * The type of input. Accepted values correspond to the standard HTML5 input types.
			 *
			 * @type {String}
			 * @default 'text'
			 * @public
			 */
			type: PropTypes.string,

			/**
			 * The value of the input.
			 *
			 * @type {String|Number}
			 * @public
			 */
			value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
		},

		defaultProps: {
			invalidMessage: $L('Please enter a valid value.')
		},

		styles: {
			css: componentCss,
			className: 'input'
		},

		computed: {
			'aria-label': ({placeholder, type, value}) => {
				const title = (value == null || value === '') ? placeholder : '';
				return calcAriaLabel(title, type, value);
			}
		},

		render: (props) => {
			return (
				<UiInput {...props} InputDecoratorIcon={InputDecoratorIcon} Tooltip={Tooltip} />
			);
		}
	});
});

/**
 * An input component. It supports start and end icons. Note that this base component is not
 * stateless as many other base components are. However, it does not support Spotlight. Apps will
 * want to use {@link moonstone/Input.Input}.
 *
 * @class InputBase
 * @memberof moonstone/Input
 * @extends ui/Input.Input
 * @ui
 * @public
 */
const InputBase = InputBaseFactory();

/**
 * A factory for customizing the visual style of [Input]{@link moonstone/Input.Input}.
 * @see {@link moonstone/Input.InputBaseFactory}.
 *
 * @class InputFactory
 * @memberof moonstone/Input
 * @factory
 * @public
 */
const InputFactory = (props) => Skinnable(
	InputBaseFactory(props)
);

/**
 * A Spottable input component. It supports pre and post icons.
 *
 * By default, `Input` maintains the state of its `value` property. Supply the `defaultValue`
 * property to control its initial value. If you wish to directly control updates to the component,
 * supply a value to `value` at creation time and update it in response to `onChange` events.
 *
 * @class Input
 * @memberof moonstone/Input
 * @extends moonstone/Input.InputBase
 * @mixes ui/Changeable.Changeable
 * @mixes moonstone/Input/InputSpotlightDecorator
 * @mixes moonstone/Skinnable.Skinnable
 * @ui
 * @public
 */
const Input = InputFactory();

export default Input;
export {
	calcAriaLabel,
	Input,
	InputBase,
	InputFactory,
	InputBaseFactory,
	InputSpotlightDecorator
};
