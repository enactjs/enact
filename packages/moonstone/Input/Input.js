/**
 * Exports the {@link moonstone/Input.Input} and {@link moonstone/Input.InputBase} components.
 *
 * @module moonstone/Input
 */

import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import React from 'react';
import {InputFactory as UiInputFactory, calcAriaLabel} from '@enact/ui/Input';

// import $L from '../internal/$L';
import Skinnable from '../Skinnable';
import {Tooltip} from '../TooltipDecorator';

import {InputDecoratorIconFactory} from './InputDecoratorIcon';
import InputSpotlightDecorator from './InputSpotlightDecorator';

import componentCss from './Input.less';

/**
 * {@link moonstone/Input.Input} is a stateless Input with Moonstone styling
 * applied.
 *
 * @class Input
 * @memberof moonstone/Input
 * @ui
 * @public
 */
const InputBaseFactory = factory({css: componentCss}, ({css}) => {
	// diffClasses('Moon IconButton', componentCss, css);

	const UiInput = UiInputFactory({
		/* Replace classes in this step */
		css: /** @lends moonstone/Input.InputFactory.prototype */ {
			...componentCss,
			// Include the component class name so it too may be overridden.
			input: css.input
		}
	});
	const InputDecoratorIcon = InputDecoratorIconFactory({css});

	/**
	 * {@link moonstone/Input.InputBase} is a Moonstone styled input component. It supports start and end
	 * icons. Note that this base component is not stateless as many other base components are. However,
	 * it does not support Spotlight. Apps will want to use {@link moonstone/Input.Input}.
	 *
	 * @class InputBase
	 * @memberof moonstone/Input
	 * @ui
	 * @public
	 */
	return kind({
		name: 'MoonstoneInput',

		styles: {
			css: componentCss,
			className: 'input'
		},

		render: (props) => {
			return (
				<UiInput {...props} InputDecoratorIcon={InputDecoratorIcon} Tooltip={Tooltip} />
			);
		}
	});
});

const InputBase = InputBaseFactory();

/**
 * {@link moonstone/Input.Input} is a Spottable, Moonstone styled input component. It supports pre
 * and post icons.
 *
 * By default, `Input` maintains the state of its `value` property. Supply the
 * `defaultValue` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `value` at creation time and update it in response to
 * `onChange` events.
 *
 * @class Input
 * @memberof moonstone/Input
 * @mixes ui/Changeable.Changeable
 * @mixes moonstone/Input/InputSpotlightDecorator
 * @ui
 * @public
 */
const Input = Skinnable(
	InputBase
);

const InputFactory = (props) => Skinnable(
	InputBaseFactory(props)
);

export default Input;
export {
	calcAriaLabel,
	Input,
	InputBase,
	InputFactory,
	InputBaseFactory,
	InputSpotlightDecorator
};
