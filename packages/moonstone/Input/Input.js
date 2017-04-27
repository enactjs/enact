/**
 * Exports the {@link moonstone/Input.Input} and {@link moonstone/Input.InputBase} components.
 *
 * @module moonstone/Input
 */

import $L from '@enact/i18n/$L';
import Changeable from '@enact/ui/Changeable';
import kind from '@enact/core/kind';
import {isRtlText} from '@enact/i18n/util';
import React from 'react';
import PropTypes from 'prop-types';

import css from './Input.less';
import InputDecoratorIcon from './InputDecoratorIcon';
import InputInvalidDecorator from './InputInvalidDecorator';
import InputSpotlightDecorator from './InputSpotlightDecorator';

const calcAriaLabel = function (title, type, value = '') {
	const hint = $L('input field');

	if (type === 'password' && value) {
		const character = value.length > 1 ? $L('characters') : $L('character');
		value = `${value.length} ${character}`;
	}

	return `${title} ${value} ${hint}`;
};

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
		iconAfter: PropTypes.string,

		/**
		 * The icon to be placed at the beginning of the input.
		 *
		 * @see {@link moonstone/Icon.Icon}
		 * @type {String}
		 * @public
		 */
		iconBefore: PropTypes.string,

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
		disabled: false,
		dismissOnEnter: false,
		placeholder: '',
		type: 'text'
	},

	styles: {
		css,
		className: 'decorator'
	},

	handlers: {
		onChange: (ev, {onChange}) => {
			if (onChange) {
				onChange({value: ev.target.value});
			}
		}
	},

	computed: {
		'aria-label': ({placeholder, type, value}) => {
			const title = (value == null || value === '') ? placeholder : '';
			return calcAriaLabel(title, type, value);
		},
		className: ({focused, styler}) => styler.append({focused}),
		dir: ({value, placeholder}) => isRtlText(value || placeholder) ? 'rtl' : 'ltr',
		// ensure we have a value so the internal <input> is always controlled
		value: ({value}) => typeof value === 'number' ? value : (value || '')
	},

	render: ({dir, disabled, iconAfter, iconBefore, onChange, placeholder, type, value, ...rest}) => {
		delete rest.dismissOnEnter;
		delete rest.focused;

		return (
			<div {...rest} disabled={disabled}>
				<InputDecoratorIcon position="before">{iconBefore}</InputDecoratorIcon>
				<input
					aria-disabled={disabled}
					className={css.input}
					dir={dir}
					disabled={disabled}
					onChange={onChange}
					placeholder={placeholder}
					type={type}
					value={value}
				/>
				<InputDecoratorIcon position="after">{iconAfter}</InputDecoratorIcon>
			</div>
		);
	}
});

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
const Input = Changeable(
	InputInvalidDecorator(
		InputSpotlightDecorator(
			InputBase
		)
	)
);

export default Input;
export {
	calcAriaLabel,
	Input,
	InputBase
};
