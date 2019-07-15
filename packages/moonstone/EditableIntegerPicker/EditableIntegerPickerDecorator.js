import {addAll, is} from '@enact/core/keymap';
import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import Spotlight from '@enact/spotlight';
import Pause from '@enact/spotlight/Pause';

addAll({
	minus: [109,  189],
	numSet: [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105],
	plus: 107
});

/**
 *{@link moonstone/EditableIntegerPicker.EditableIntegerPickerDecorator} is a higher-order component
 * which handles various functionalities of {@link moonstone/EditableIntegerPicker.EditableIntegerPicker}.
 *
 * @class EditableIntegerPickerDecorator
 * @memberof moonstone/EditableIntegerPicker
 * @hoc
 * @private
 */
const EditableIntegerPickerDecorator = hoc((config, Wrapped) => {	// eslint-disable-line no-unused-vars
	// Set-up event forwarding
	const forwardBlur = forward('onBlur');
	const forwardChange = forward('onChange');
	const forwardClick = forward('onClick');
	const forwardKeyDown = forward('onKeyDown');

	return class extends React.Component {

		static displayName = 'EditableIntegerPickerDecorator'

		static propTypes =  /** @lends moonstone/EditableIntegerPicker.EditableIntegerPickerDecorator.prototype */ {
			/**
		 	* The maximum value selectable by the picker (inclusive).
		 	*
		 	* @type {Number}
			* @required
		 	* @public
		 	*/
			max: PropTypes.number.isRequired,

			/**
			 * The minimum value selectable by the picker (inclusive).
			 *
			 * @type {Number}
			 * @required
			 * @public
			 */
			min: PropTypes.number.isRequired,

			/**
			 * Disables EditableIntegerPicker and does not generate `onChange`
			 * [events]{@link /docs/developer-guide/glossary/#event}.
			 *
			 * @type {Boolean}
			 * @public
			 */
			disabled: PropTypes.bool,

			/**
			 * The value displayed in the picker.
			 *
			 * @type {Number}
			 * @default 0
			 * @public
			 */
			value: PropTypes.number
		}

		static defaultProps = {
			value: 0
		}

		constructor (props) {
			super(props);
			this.paused = new Pause('EditableIntegerPickerDecorator');
			this.state = {
				isActive: false,
				value: props.value
			};
		}

		handleChange = (ev) => {
			if (!this.state.isActive) {
				this.setState({
					value: this.validateValue(parseInt(ev.value))
				});
			}
			forwardChange(ev, this.props);
		}

		prepareInput = () => {
			this.setState({
				isActive: true
			});
			this.freezeSpotlight(true);
		}

		handleClick = (ev) => {
			if (!this.props.disabled && ev.type === 'click') {
				this.prepareInput();
			}
			forwardClick(ev, this.props);
		}

		getInputNode = (node) => {
			if (node) {
				this.inputNode = node;
				Spotlight.focus(this.inputNode);
			}
		}

		getPickerNode = (node) => {
			this.pickerNode = ReactDOM.findDOMNode(node);	// eslint-disable-line react/no-find-dom-node
		}

		freezeSpotlight = (freeze) => {
			if (!freeze) {
				this.paused.resume();
			} else {
				this.paused.pause();
			}
		}

		handleKeyDown = (ev) => {
			const keyCode = ev.keyCode;
			if (this.props.disabled) return;
			if ((is('enter', keyCode) && !this.state.isActive) || (is('numSet', keyCode) && !this.state.isActive) || (is('plus', keyCode) || is('minus', keyCode))) {
				this.prepareInput();
			} else if (this.state.isActive && (is('enter', keyCode) || is('cancel', keyCode) || is('up', keyCode) || is('down', keyCode))) {
				this.handleBlur(ev);
			}
			forwardKeyDown(ev, this.props);
		}

		handleBlur = (ev) => {
			this.setState({
				value: this.validateValue(parseInt(ev.target.value)),
				isActive: false
			}, () => {
				Spotlight.focus(this.pickerNode);
				this.freezeSpotlight(false);
			});
			forwardBlur(ev, this.props);
		}

		validateValue = (value) => {
			return (value <= this.props.max) && (value >= this.props.min) ? value : this.state.value;
		}

		render () {
			return (
				<Wrapped
					{...this.props}
					editMode={this.state.isActive}
					inputRef={this.getInputNode}
					joined
					onChange={this.handleChange}
					onPickerItemClick={this.handleClick}
					onInputBlur={this.handleBlur}
					onKeyDown={this.handleKeyDown}
					pickerRef={this.getPickerNode}
					value={this.state.value}
				/>
			);
		}
	};
});

export default EditableIntegerPickerDecorator;
export {EditableIntegerPickerDecorator};
