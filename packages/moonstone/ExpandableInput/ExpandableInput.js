import Changeable from '@enact/ui/Changeable';
import {Spotlight, Spottable} from '@enact/spotlight';
import React from 'react';

import {Expandable, ExpandableItemBase} from '../ExpandableItem';
import {Input} from '../Input';

class Div extends React.Component {
	render () {
		const {componentRef, ...rest} = this.props;
		return (
			<div {...rest} ref={componentRef} />
		);
	}
}

const SpottableDiv = Spottable(Div);

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

	componentDidUpdate (prevProps) {
		if (!prevProps.open && this.props.open) {
			this.inputInstance.decoratedNode.focus();
		}
	}

	onInputKeyDown = (ev) => {
		const keyCode = ev.keyCode;
		switch (keyCode) {
			case 13:
				if (ev.target === this.inputInstance.decoratedNode) {
					this.fireChangeEvent();
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
		Spotlight.focus(this.spotlightDummyNode);
	}

	getInputInstance = (instance) => {
		this.focusableInstance = instance;
		this.inputInstance = instance.wrappedInstance;
	}

	getSpotlightDummyNode = (node) => {
		this.spotlightDummyNode = node;
	}

	render () {
		const {disabled, onInputChange, placeholder, type, value, ...rest} = this.props;
		return (
			<ExpandableItemBase {...rest} disabled={disabled}>
				<Input
					disabled={disabled}
					dismissOnEnter
					onChange={onInputChange}
					onKeyDown={this.onInputKeyDown}
					placeholder={placeholder}
					ref={this.getInputInstance}
					type={type}
					value={value}
				/>
				<SpottableDiv componentRef={this.getSpotlightDummyNode} />
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
