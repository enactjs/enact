import hoc from '@enact/core/hoc';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Spotlight from '@enact/spotlight';
import {addAll, is} from '@enact/core/keymap';
import {forward} from '@enact/core/handle';
import css from './SimpleIntegerPicker.less';
import classNames from 'classnames';
import {contextTypes} from '@enact/core/internal/PubSub';

addAll({
	minus: 109,
	numSet: [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105],
	plus: 107
});

const SimpleIntegerPickerDecorator = hoc((config, Wrapped) => {
	// Set-up event forwarding
	const forwardBlur = forward('onBlur');
	const forwardChange = forward('onChange');
	const forwardClick = forward('onClick');

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
			disabled: PropTypes.bool,

			/**
			 * The value by default the picker needs to show when loading for the first time
			 *
			 * @type {Number}
			 * @public
			 */
			value: PropTypes.number
		}

		static defaultProps = {
			value: 0
		}

		constructor (props) {
			super(props);
			this.state = {
				isClicked: false,
				value: this.props.value ? this.props.value : 0
			};
		}

		componentWillMount () {
			if (this.props.value) {
				this.setState({
					value: this.props.value
				});
			}
		}

		handleChange = (ev) => {
			if (!this.state.isClicked) {
				this.setState({
					value: this.validateValue(parseInt(ev.value))
				});
				forwardChange(ev, this.props);
			} else {
				return false;
			}
		}

		prepareInput = () => {
			this.setState({
				isClicked: true
			});
			this.freezeSpotlight(true);
		}

		handleClick = (ev) => {
			if (!this.props.disabled && ev.target.className.indexOf('marquee') > -1 ) {
				this.prepareInput();
			}
			forwardClick(ev, this.props);
		}

		getInputNode = (node) => {
			if (node) {
				this.inputNode = node;
				this.inputNode.focus();
			}
		}

		getPickerNode = (node) => {
			this.pickerNode = ReactDOM.findDOMNode(node);	// eslint-disable-line react/no-find-dom-node
		}

		freezeSpotlight = (freeze) => {
			const pointerMode = Spotlight.getPointerMode();
			if (!freeze) {
				Spotlight.resume();
				Spotlight.setPointerMode(pointerMode);
			} else {
				Spotlight.pause();
				// we temporarily set the pointer mode to false when the input field is enabled.
				Spotlight.setPointerMode(false);
			}
		}

		handleDown = (ev) => {
			const keyCode = ev.keyCode;
			if ((is('enter', keyCode) && !this.state.isClicked) || is('numSet', keyCode) || (is('plus', keyCode) || is('minus', keyCode))) {
				this.prepareInput();
			} else if (this.state.isClicked && (is('enter', keyCode) || is('cancel', keyCode) || is('up', keyCode) || is('down', keyCode))) {
				this.handleBlur(ev);
			} else {
				return false;
			}
		}

		handleBlur = (ev) => {
			this.setState({
				value: this.validateValue(parseInt(ev.target.value)),
				isClicked: false
			}, () => {
				this.inputNode.className = classNames(this.inputNode.className, css.hideInput);
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
					isInputMode={this.state.isClicked}
					inputRef={this.getInputNode}
					joined
					onChange={this.handleChange}
					onClick={this.handleClick}
					onInputBlur={this.handleBlur}
					onKeyDown={this.handleDown}
					pickerRef={this.getPickerNode}
					value={this.state.value}
				/>
			);
		}
	};
});

export default SimpleIntegerPickerDecorator;
export {SimpleIntegerPickerDecorator};
