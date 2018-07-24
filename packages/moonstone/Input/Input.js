/**
 * Moonstone styled input components.
 *
 * @example
 * <Input placeholder="Enter text here" />
 *
 * @module moonstone/Input
 * @exports Input
 * @exports InputBase
 */

import kind from '@enact/core/kind';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
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
 * A Moonstone styled input component.
 *
 * It supports start and end icons. Note that this base component is not stateless as many other
 * base components are. However, it does not support Spotlight. Apps will want to use
 * {@link moonstone/Input.Input}.
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
		 * Disables Input and becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Blurs the input when the "enter" key is pressed.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		dismissOnEnter: PropTypes.bool,

		/**
		 * Adds a `focused` class to the input decorator.
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
		 * Indicates [value]{@link moonstone/Input.InputBase.value} is invalid and shows
		 * [invalidMessage]{@link moonstone/Input.InputBase.invalidMessage}, if set.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		invalid: PropTypes.bool,

		/**
		 * The tooltip text to be displayed when the input is
		 * [invalid]{@link moonstone/Input.InputBase.invalid}.
		 *
		 * If this value is *falsy*, the tooltip will not be shown.
		 *
		 * @type {String}
		 * @default ''
		 * @public
		 */
		invalidMessage: PropTypes.string,

		/**
		 * Called when blurred.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onBlur: PropTypes.func,

		/**
		 * Called when the input value is changed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onChange: PropTypes.func,

		/**
		 * Called when clicked.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onClick: PropTypes.func,

		/**
		 * Called when focused.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onFocus: PropTypes.func,

		/**
		 * Called when a key is pressed down.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onKeyDown: PropTypes.func,

		/**
		 * Text to display when [value]{@link moonstone/Input.InputBase.value} is not set.
		 *
		 * @type {String}
		 * @default ''
		 * @public
		 */
		placeholder: PropTypes.string,

		/**
		 * Indicates the content's text direction is right-to-left.
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
		 * The type of input.
		 *
		 * Accepted values correspond to the standard HTML5 input types.
		 *
		 * @type {String}
		 * @see [MDN input types doc]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types}
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
					tabIndex={-1}
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
 * A Spottable, Moonstone styled input component with embedded icon support.
 *
 * By default, `Input` maintains the state of its `value` property. Supply the `defaultValue`
 * property to control its initial value. If you wish to directly control updates to the component,
 * supply a value to `value` at creation time and update it in response to `onChange` events.
 *
 * @class Input
 * @memberof moonstone/Input
 * @extends moonstone/Input.InputBase
 * @mixes ui/Changeable.Changeable
 * @mixes spotlight/Spottable.Spottable
 * @ui
 * @public
 */
const Input = Pure(
	I18nContextDecorator(
		{rtlProp: 'rtl'},
		Changeable(
			InputSpotlightDecorator(
				Skinnable(
					InputBase
				)
			)
		)
	)
);

/**
 * Focuses the internal input when the component gains 5-way focus.
 *
 * By default, the internal input is not editable when the component is focused via 5-way and must
 * be selected to become interactive. In pointer mode, the input will be editable when clicked.
 *
 * @name autoFocus
 * @memberof moonstone/Input.Input.prototype
 * @type {Boolean}
 * @default false
 * @public
 */

/**
 * Applies a disabled style and prevents interacting with the component.
 *
 * @name disabled
 * @memberof moonstone/Input.Input.prototype
 * @type {Boolean}
 * @default false
 * @public
 */

/**
 * Sets the initial value.
 *
 * @name defaultValue
 * @memberof moonstone/Input.Input.prototype
 * @type {String}
 * @public
 */

/**
 * Blurs the input when the "enter" key is pressed.
 *
 * @name dismissOnEnter
 * @memberof moonstone/Input.Input.prototype
 * @type {Boolean}
 * @default false
 * @public
 */

/**
 * Called when the internal input is focused.
 *
 * @name onActivate
 * @memberof moonstone/Input.Input.prototype
 * @type {Function}
 * @param {Object} event
 * @public
 */

/**
 * Called when the internal input loses focus.
 *
 * @name onDeactivate
 * @memberof moonstone/Input.Input.prototype
 * @type {Function}
 * @param {Object} event
 * @public
 */

/**
 * Called when the component is removed when it had focus.
 *
 * @name onSpotlightDisappear
 * @memberof moonstone/Input.Input.prototype
 * @type {Function}
 * @param {Object} event
 * @public
 */

/**
 * Prevents navigation of the component using spotlight.
 *
 * @name spotlightDisabled
 * @memberof moonstone/Input.Input.prototype
 * @type {Boolean}
 * @default false
 * @public
 */

export default Input;
export {
	calcAriaLabel,
	extractInputProps,
	Input,
	InputBase
};
