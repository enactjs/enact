import hoc from '@enact/core/hoc';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Spotlight from '@enact/spotlight';
import {add, is} from '@enact/core/keymap';
import {forward} from '@enact/core/handle';
import css from './SimpleIntegerPicker.less';
import {contextTypes} from '@enact/core/internal/PubSub';

// Set-up event forwarding
const forwardBlur = forward('onBlur');
const forwardChange = forward('onChange');

add('plus', 107);
add('minus', 109);
add('numSet', [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105]);

const SimpleIntegerPickerDecorator = hoc((config, Wrapped) => {

	return class extends React.Component {

		static displayName = 'SimpleIntegerPickerDecorator'

		static contextTypes = contextTypes

		static propTypes =  /** @lends moonstone/SimpleIntegerPicker.SimpleIntegerPickerDecorator.prototype */ {
			/**
		 	* The maximum value selectable by the picker (inclusive).
		 	*
		 	* @type {Number}
		 	* @public
		 	*/
			max: PropTypes.number.isRequired,

			/**
			 * The minimum value selectable by the picker (inclusive).
			 *
			 * @type {Number}
			 * @public
			 */
			min: PropTypes.number.isRequired,

			/**
			 * When `true`, the SimpleIntegerPicker is shown as disabled and does not generate `onChange`
			 * [events]{@glossary event}.
			 *
			 * @type {Boolean}
			 * @public
			 */
			disabled: PropTypes.bool
		}

		static defaultProps = {
			disabled : false,
			max : 100,
			min : 0
		}

		constructor (props) {
			super(props);
			this.state = {
				isClicked: false,
				value : 0
			};
		}

		validateValue = (value) => {
			return (value <= this.props.max) && (value >= this.props.min) ? value : this.state.value;
		}

		handleChange = (ev) => {
			if (!this.state.isClicked) {
				this.setState({
					value: this.validateValue(parseInt(ev.value))
				});
				forwardChange({value: this.validateValue(parseInt(ev.value))}, this.props);
			} else {
				return false;
			}
		}

		prepareInput = () => {
			this.setState({
				isClicked: true
			});
			this.handleSpotlight(true);
		}

		focusInput = (node) => {
			node.focus();
		}

		inputChangeHandler = (ev) => {
			let keyCode = ev.keyCode;
			if (is('enter', keyCode) || is('cancel', keyCode) || is('up', keyCode) || is('down', keyCode)) {
				this.handleBlur(ev);
			}
		}

		handleClick = (ev, props) => {
			if (!props.disabled && ev.target.className.indexOf('marquee') > -1 ) {
				this.prepareInput();
			}
		}

		getInputNode = (node) => {
			this.inputNode = ReactDOM.findDOMNode(node);	// eslint-disable-line react/no-find-dom-node
			if (this.inputNode) this.focusInput(this.inputNode);
		}

		getPickerNode = (node) => {
			this.pickerNode = ReactDOM.findDOMNode(node);	// eslint-disable-line react/no-find-dom-node
		}

		handleSpotlight = (isHandleSpotlight) => {
			if (!isHandleSpotlight) {
				Spotlight.resume();
				Spotlight.setPointerMode(true);
			} else {
				Spotlight.pause();
				Spotlight.setPointerMode(false);
			}
		}

		handleDown = (ev) => {
			let keyCode = ev.keyCode;
			if ((is('enter', keyCode) && !this.state.isClicked) || is('numSet', keyCode) || (is('plus', keyCode) || is('minus', keyCode))) {
				this.prepareInput();
			}
		}

		handleBlur = (ev) => {
			this.inputNode.className = css.hideInput;
			this.setState({
				value: this.validateValue(parseInt(ev.target.value)),
				isClicked: false
			}, () => {
				Spotlight.focus(this.pickerNode);
				this.handleSpotlight(false);
			});
			forwardBlur({value: this.validateValue(parseInt(ev.target.value))}, this.props);
		}

		render () {
			return (
				<Wrapped
					inputChange={this.inputChangeHandler}
					isInputMode={this.state.isClicked}
					inputRef={this.getInputNode}
					inputValue={this.state.value}
					onBlurHandler={this.handleBlur}
					onChangeHandler={this.handleChange}
					onClickHandler={this.handleClick}
					onKeyDownHandler={this.handleDown}
					pickerRef={this.getPickerNode}
					{...this.props}
				/>
			);
		}
	};
});

export default SimpleIntegerPickerDecorator;
export {SimpleIntegerPickerDecorator};
