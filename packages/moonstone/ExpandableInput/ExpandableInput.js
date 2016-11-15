import Changeable from '@enact/ui/Changeable';
import React from 'react';

import {Expandable, ExpandableItemBase} from '../ExpandableItem';
import {Input} from '../Input';

class ExpandableInputBase extends React.Component {
	static displayName = 'ExpandableInput'

	static propTypes = {
		/**
		 * When `true`, applies a disabled style and the control becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: React.PropTypes.bool,

		/**
		 * The handler to run when the input value is changed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onChange: React.PropTypes.func,

		/**
		 * The placeholder text to display.
		 *
		 * @type {String}
		 * @default ''
		 * @public
		 */
		placeholder: React.PropTypes.string,

		/**
		 * The type of input. Accepted values correspond to the standard HTML5 input types.
		 *
		 * @type {String}
		 * @default 'text'
		 * @public
		 */
		type: React.PropTypes.string,

		/**
		 * The value of the input.
		 *
		 * @type {String|Number}
		 * @default ''
		 * @public
		 */
		value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number])
	}

	onInputKeyDown = (ev) => {
		const keyCode = ev.keyCode;
		const isInputFocused = ev.target !== ev.currentTarget;

		switch (keyCode) {
			case 13:
				if (isInputFocused) {
					this.fireChangeEvent();
					// prevent the onKeyPress event which will fire on ExpandableItem since it will
					// have received focus
					ev.preventDefault();
				}
				break;
			case 38:
			case 40:
				this.fireChangeEvent();
				break;
		}
	}

	fireChangeEvent = () => {
		const {onChange, onClose, value} = this.props;

		if (onClose) {
			onClose();
		}

		if (onChange) {
			onChange({value});
		}
	}

	render () {
		const {disabled, onInputChange, placeholder, type, value, ...rest} = this.props;
		return (
			<ExpandableItemBase {...rest} disabled={disabled}>
				<Input
					disabled={disabled}
					dismissOnEnter
					noDecorator
					onChange={onInputChange}
					onKeyDown={this.onInputKeyDown}
					placeholder={placeholder}
					type={type}
					value={value}
					data-spot-up=''
					data-spot-down=''
				/>
			</ExpandableItemBase>
		);
	}
}

const ExpandableInput = Expandable(
	Changeable(
		{mutable: true, change: 'onInputChange'},
		ExpandableInputBase
	)
);

export default ExpandableInput;
export {ExpandableInput, ExpandableInputBase};
