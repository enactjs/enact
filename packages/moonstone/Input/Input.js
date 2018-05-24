/**
 * Exports the {@link moonstone/Input.Input} and {@link moonstone/Input.InputBase} components.
 *
 * @module moonstone/Input
 */

import kind from '@enact/core/kind';
import {Subscription} from '@enact/core/internal/PubSub';
import {contextTypes} from '@enact/i18n/I18nDecorator';
import {isRtlText} from '@enact/i18n/util';
import Changeable from '@enact/ui/Changeable';
import Pure from '@enact/ui/internal/Pure';
import PropTypes from 'prop-types';
import React from 'react';

import $L from '../internal/$L';
import Skinnable from '../Skinnable';
import Tooltip from '../TooltipDecorator/Tooltip';

import componentCss from './Input.less';
import InputDecoratorIcon from './InputDecoratorIcon';
import InputSpotlightDecorator from './InputSpotlightDecorator';
import {calcAriaLabel, extractInputProps} from './util';

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

		// TODO: Document voice control props and make public
		'data-webos-voice-group-label': PropTypes.string,
		'data-webos-voice-intent': PropTypes.string,
		'data-webos-voice-label': PropTypes.string,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * The following classes are supported:
		 *
		 * * `decorator` - The root class name
		 * * `input` - The <input> class name
		 *
		 * @type {Object}
		 * @private
		 */
		css: PropTypes.object,

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
		 * The placeholder text to display.
		 *
		 * @type {String}
		 * @default ''
		 * @public
		 */
		placeholder: PropTypes.string,

		/**
		 * When `true`, current locale is RTL
		 *
		 * @type {Boolean}
		 * @private
		 */
		rtl: PropTypes.bool,

		/**
		 * Applies the `small` CSS class.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		small: PropTypes.bool,

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
		invalid: false,
		placeholder: '',
		type: 'text'
	},

	contextTypes,

	styles: {
		css: componentCss,
		className: 'decorator',
		publicClassNames: ['decorator', 'input']
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
		className: ({focused, invalid, small, styler}) => styler.append({focused, invalid, small}),
		dir: ({value, placeholder}) => isRtlText(value || placeholder) ? 'rtl' : 'ltr',
		invalidTooltip: ({css, invalid, invalidMessage = $L('Please enter a valid value.'), rtl}) => {
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

	render: ({css, dir, disabled, iconAfter, iconBefore, invalidTooltip, onChange, placeholder, small, type, value, 'data-webos-voice-group-label': voiceGroupLabel, 'data-webos-voice-intent' : voiceIntent, 'data-webos-voice-label': voiceLabel, ...rest}) => {
		const inputProps = extractInputProps(rest);
		delete rest.dismissOnEnter;
		delete rest.focused;
		delete rest.invalid;
		delete rest.invalidMessage;
		delete rest.rtl;

		return (
			<div {...rest} disabled={disabled}>
				<InputDecoratorIcon position="before" small={small}>{iconBefore}</InputDecoratorIcon>
				<input
					{...inputProps}
					aria-disabled={disabled}
					className={css.input}
					data-webos-voice-group-label={voiceGroupLabel}
					data-webos-voice-intent={voiceIntent}
					data-webos-voice-label={voiceLabel}
					dir={dir}
					disabled={disabled}
					onChange={onChange}
					placeholder={placeholder}
					type={type}
					value={value}
				/>
				<InputDecoratorIcon position="after" small={small}>{iconAfter}</InputDecoratorIcon>
				{invalidTooltip}
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
const Input = Pure(
	Subscription(
		{channels: ['i18n'], mapMessageToProps: (channel, {rtl}) => ({rtl})},
		Changeable(
			InputSpotlightDecorator(
				Skinnable(
					InputBase
				)
			)
		)
	)
);

export default Input;
export {
	calcAriaLabel,
	extractInputProps,
	Input,
	InputBase
};
