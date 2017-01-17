import Changeable from '@enact/ui/Changeable';
import {forward} from '@enact/core/handle';
import {is} from '@enact/core/keymap';
import React from 'react';

import {Expandable, ExpandableItemBase} from '../ExpandableItem';
import {Input} from '../Input';

const forwardClose = forward('onClose');
const forwardMouseDown = forward('onMouseDown');

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
		 * The handler to run when the expandable value is changed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onChange: React.PropTypes.func,

		/**
		 * Callback to be called when a condition occurs which should cause the expandable to close
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onClose: React.PropTypes.func,

		/**
		 * The handler to run when the input value is changed.
		 *
		 * @type {Function}
		 * @public
		 */
		onInputChange: React.PropTypes.func,

		/**
		 * When `true`, the control is rendered in the expanded state, with the contents visible
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		open: React.PropTypes.bool,

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

		const isEnter = is('enter', keyCode);
		const isUpDown = is('up', keyCode) || is('down', keyCode);

		if (isEnter) {
			// prevent Enter onKeyPress which would re-open the expandable when the label
			// receives focus
			ev.preventDefault();
		} else if (isUpDown) {
			// prevent Spotlight handling up/down since closing the expandable will spot the label
			ev.nativeEvent.stopImmediatePropagation();
		}

		if (isEnter || isUpDown) {
			this.fireChangeEvent();
		}
	}

	handleInputBlur = () => {
		// if `open` is `false`, the contained <input> has lost focus due to 5-way navigation
		// in `handleInputKeyDown`, where the `fireChangeEvent` method has already been called
		// verify the expandable is open before calling that method again.
		if (this.props.open) {
			this.fireChangeEvent();
		}
	}

	handleMouseDown = (ev) => {
		// if the contained <input> has focus, prevent onClicks so that clicking on the LabeledItem
		// doesn't open the expandable immediately after blurring the <input> closed it.
		if (ev.currentTarget.contains(document.activeElement)) {
			ev.preventDefault();
		}

		forwardMouseDown(ev);
	}

	handleInputMouseDown = (ev) => {
		// prevent onMouseDown events from the <input> itself from bubbling up to be prevented by
		// handleMouseDown
		ev.stopPropagation();
	}

	handleClose = (ev) => {
		this.fireChangeEvent();
		forwardClose(ev);
	}

	render () {
		const {disabled, onInputChange, placeholder, type, value, ...rest} = this.props;
		delete rest.onChange;

		return (
			<ExpandableItemBase
				{...rest}
				disabled={disabled}
				label={value}
				noPointerMode
				onClose={this.handleClose}
				onMouseDown={this.handleMouseDown}
			>
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
