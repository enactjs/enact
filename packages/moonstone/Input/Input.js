/**
 * Exports the {@link moonstone/Input.Input} and {@link moonstone/Input.InputBase} components.
 *
 * @module moonstone/Input
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import css from './Input.less';
import InputDecoratorIcon from './InputDecoratorIcon';
import InputSpotlightDecorator from './InputSpotlightDecorator';

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
const InputBase = kind({
	name: 'Input',

	propTypes: /** @lends moonstone/Input.InputBase.prototype */ {
		/**
		 * When `true`, applies a disabled style and the control becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * When `true`, blurs the input when the "enter" key is pressed.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		dismissOnEnter: PropTypes.bool,

		/**
		 * When `true`, adds a `focused` class to the input decorator
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		focused: PropTypes.bool,

		/**
		 * The icon to be placed at the end of the input.
		 *
		 * @see {@link moonstone/Icon.Icon}
		 * @type {String}
		 * @public
		 */
		iconEnd: PropTypes.string,

		/**
		 * The icon to be placed at the beginning of the input.
		 *
		 * @see {@link moonstone/Icon.Icon}
		 * @type {String}
		 * @public
		 */
		iconStart: PropTypes.string,

		/**
		 * The handler to run when blurred.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onBlur: PropTypes.func,

		/**
		 * The handler to run when the input value is changed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onChange: PropTypes.func,

		/**
		 * The handler to run when clicked.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onClick: PropTypes.func,

		/**
		 * The handler to run when focused.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onFocus: PropTypes.func,

		/**
		 * The handler to run when a key is pressed down.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onKeyDown: PropTypes.func,

		/**
		 * The handler to run when a mouse key is pressed down.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onMouseDown: PropTypes.func,

		/**
		 * The placeholder text to display.
		 *
		 * @type {String}
		 * @default ''
		 * @public
		 */
		placeholder: PropTypes.string,

		/**
		 * When `true`, spotlight navigation is prevented for the input.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		spotlightDisabled: PropTypes.bool,

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
		 * @default ''
		 * @public
		 */
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
	},

	defaultProps: {
		disabled: false,
		dismissOnEnter: false,
		placeholder: '',
		type: 'text',
		value: ''
	},

	styles: {
		css,
		className: 'decorator'
	},

	computed: {
		className: ({focused, styler}) => styler.append({focused}),
		onChange: ({onChange}) => (ev) => {
			if (onChange) {
				onChange({value: ev.target.value});
			}
		}
	},

	render: ({disabled, iconEnd, iconStart, onChange, placeholder, type, value, ...rest}) => {
		delete rest.dismissOnEnter;
		delete rest.focused;

		return (
			<div {...rest} disabled={disabled}>
				<InputDecoratorIcon position="start">{iconStart}</InputDecoratorIcon>
				<input
					className={css.input}
					disabled={disabled}
					onChange={onChange}
					placeholder={placeholder}
					type={type}
					value={value}
				/>
				<InputDecoratorIcon position="end">{iconEnd}</InputDecoratorIcon>
			</div>
		);
	}
});

/**
 * {@link moonstone/Input.Input} is a Spottable, Moonstone styled input component. It supports pre and post
 * icons.
 *
 * @class Input
 * @memberof moonstone/Input
 * @ui
 * @mixes moonstone/Input/InputSpotlightDecorator
 * @public
 */
const Input = InputSpotlightDecorator(InputBase);

export default Input;
export {Input, InputBase};
