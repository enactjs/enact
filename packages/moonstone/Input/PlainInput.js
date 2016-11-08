/**
 * Exports the {@link moonstone/Input/PlainInput.PlainInput} and
 * {@link moonstone/Input/PlainInput.PlainInputBase} components.
 *
 * @module moonstone/Input/PlainInput
 * @private
 */

import kind from '@enact/core/kind';
import {Spottable} from '@enact/spotlight';
import React, {PropTypes} from 'react';

import css from './Input.less';

/**
 * {@link moonstone/Input/PlainInput.PlainInputBase} is an input component used by the framework
 * internally.
 *
 * @class InputBase
 * @memberof moonstone/Input/PlainInput
 * @ui
 * @private
 */
const PlainInputBase = kind({
	name: 'PlainInputBase',

	propTypes: /** @lends moonstone/Input/InputBase.InputBase.prototype */ {
		/**
		 * When `true`, applies a disabled style and the control becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * The method to run when the input mounts, giving a reference to the DOM.
		 *
		 * @type {Function}
		 * @private
		 */
		inputRef: PropTypes.func,

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
		type: 'text',
		value: ''
	},

	styles: {
		css,
		className: 'input'
	},

	computed: {
		className: ({disabled, styler}) => styler.append({disabled}),

		// standardize the synthetic React onChange event with our onChange event
		onChange: ({onChange}) => {
			if (onChange) {
				return (ev) => {
					onChange({value: ev.target.value});
				};
			}
		}
	},

	render: ({inputRef, ...rest}) => (
		<input {...rest} ref={inputRef} />
	)
});

/**
 * {@link moonstone/Input/PlainInput.PlainInput} is a spottable input component used by the framework
 * internally.
 *
 * @class InputBase
 * @memberof moonstone/Input/PlainInput
 * @ui
 * @mixes spotlight/Spottable
 * @private
 */
const PlainInput = Spottable(kind({
	name: 'PlainInput',

	render: (props) => {
		return (
			<PlainInputBase {...props} />
		);
	}
}));

export default PlainInput;
export {PlainInput, PlainInputBase};
