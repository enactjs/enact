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

	fireChangeEvent = () => {
		const {onChange, onClose, value} = this.props;

		if (onClose) {
			onClose();
		}

		if (onChange) {
			onChange({value});
		}
	}

	handleInputKeyDown = (ev) => {
		const keyCode = ev.keyCode;

		switch (keyCode) {
			case 13:
			case 38:
			case 40:
				// prevent Enter onKeyPress which would re-open the expandable when the label
				// receives focus
				ev.preventDefault();
				this.fireChangeEvent();
				break;
		}
	}

	handleInputBlur = () => {
		this.fireChangeEvent();
	}

	handleMouseDown = (ev) => {
		// if the contained <input> has focus, prevent onClicks so that clicking on the LabeledItem
		// doesn't open the expandable immediately after blurring the <input> closed it.
		if (ev.currentTarget.contains(document.activeElement)) {
			ev.preventDefault();
		}
	}

	handleInputMouseDown = (ev) => {
		// prevent onMouseDown events from the <input> itself from bubbling up to be prevented by
		// handleMouseDown
		ev.stopPropagation();
	}

	render () {
		const {disabled, onInputChange, placeholder, type, value, ...rest} = this.props;
		delete rest.onChange;

		return (
			<ExpandableItemBase {...rest} disabled={disabled} label={value} onMouseDown={this.handleMouseDown}>
				<Input
					disabled={disabled}
					dismissOnEnter
					noDecorator
					onBlur={this.handleInputBlur}
					onChange={onInputChange}
					onKeyDown={this.handleInputKeyDown}
					onMouseDown={this.handleInputMouseDown}
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
