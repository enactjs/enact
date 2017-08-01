/**
 * Exports the {@link ui/Input.Input} and {@link ui/Input.InputBase} components.
 *
 * @module ui/Input
 */

import factory from '@enact/core/factory';
import {contextTypes} from '@enact/i18n/I18nDecorator';
import kind from '@enact/core/kind';
import {isRtlText} from '@enact/i18n/util';
import React from 'react';
import PropTypes from 'prop-types';

import Changeable from '../Changeable';
import {Tooltip as UiTooltip} from '../TooltipDecorator';

import UiInputDecoratorIcon, {InputDecoratorIconFactory} from './InputDecoratorIcon';
import InputSpotlightDecorator from './InputSpotlightDecorator';

import componentCss from './Input.less';

/**
 * {@link ui/Input.InputBaseFactory} is Factory wrapper around {@link ui/Input.InputBase}
 * that allows overriding certain classes at design time. The following are properties of the `css`
 * member of the argument to the factory.
 *
 * @class InputBaseFactory
 * @memberof ui/Input
 * @factory
 * @ui
 * @public
 */
const InputBaseFactory = factory({css: componentCss}, ({css}) => {
	/**
	 * {@link ui/Input.InputBase} is a ui styled input component. It supports start and end
	 * icons. Note that this base component is not stateless as many other base components are.
	 * However, it does not support Spotlight. Apps will want to use {@link ui/Input.Input}.
	 *
	 * @class InputBase
	 * @memberof ui/Input
	 * @ui
	 * @public
	 */
	return kind({
		name: 'Input',

		propTypes: /** @lends ui/Input.InputBase.prototype */ {
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
			 * @see {@link ui/Icon.Icon}
			 * @type {String}
			 * @public
			 */
			iconAfter: PropTypes.string,

			/**
			 * The icon to be placed at the beginning of the input.
			 *
			 * @see {@link ui/Icon.Icon}
			 * @type {String}
			 * @public
			 */
			iconBefore: PropTypes.string,

			/**
			 * The InputDecoratorIcon component to use in this Input.
			 *
			 * @type {Component}
			 * @default {@link ui/InputDecoratorIcon}
			 * @public
			 */
			InputDecoratorIcon: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),

			/**
			 * When `true`, input text color is changed to red and the message tooltip is shown if it exists.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			invalid: PropTypes.bool,

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
			 * The Tooltip component to use in this Input.
			 *
			 * @type {Component}
			 * @default {@link ui/Tooltip}
			 * @public
			 */
			Tooltip: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),

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
			InputDecoratorIcon: UiInputDecoratorIcon,
			invalid: false,
			invalidMessage: 'Please enter a valid value.',
			placeholder: '',
			Tooltip: UiTooltip,
			type: 'text'
		},

		contextTypes,

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
			className: ({focused, invalid, styler}) => styler.append({focused, invalid}),
			dir: ({value, placeholder}) => isRtlText(value || placeholder) ? 'rtl' : 'ltr',
			invalidTooltip: ({invalid, invalidMessage, Tooltip}, {rtl}) => {
				if (invalid && invalidMessage) {
					const direction = rtl ? 'left' : 'right';
					return (
						<Tooltip arrowAnchor="top" className={css.invalidTooltip} direction={direction}>
							{invalidMessage}
						</Tooltip>
					);
				}
			},
			// ensure we have a value so the internal <input> is always controlled
			value: ({value}) => typeof value === 'number' ? value : (value || '')
		},

		render: ({dir, disabled, iconAfter, iconBefore, InputDecoratorIcon, invalidTooltip, onChange, placeholder, type, value, ...rest}) => {
			delete rest.dismissOnEnter;
			delete rest.focused;
			delete rest.invalid;
			delete rest.invalidMessage;
			delete rest.Tooltip;

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
					{invalidTooltip}
				</div>
			);
		}
	});
});

const InputBase = InputBaseFactory();

/**
 * {@link ui/Input.Input} is a Spottable, ui styled input component. It supports pre
 * and post icons.
 *
 * By default, `Input` maintains the state of its `value` property. Supply the
 * `defaultValue` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `value` at creation time and update it in response to
 * `onChange` events.
 *
 * @class Input
 * @memberof ui/Input
 * @mixes ui/Changeable.Changeable
 * @mixes ui/Input/InputSpotlightDecorator
 * @ui
 * @public
 */
const Input = Changeable(
	InputSpotlightDecorator(
		InputBase
	)
);

const InputFactory = (props) => Changeable(
	InputSpotlightDecorator(
		InputBaseFactory(props)
	)
);

export default Input;
export {
	Input,
	InputBase,
	InputFactory,
	InputBaseFactory,
	InputDecoratorIconFactory
};
