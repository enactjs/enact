import hoc from '@enact/core/hoc';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Spotlight from '@enact/spotlight';

import {forward} from '@enact/core/handle';

import {contextTypes} from '@enact/core/internal/PubSub';
import {handle} from '@enact/core/handle';

// Set-up event forwarding
const forwardBlur = forward('onBlur');
const forwardChange = forward('onChange');
const forwardClick = forward('onClick');

const SimpleIntegerPickerDecorator = hoc((config, Wrapped) => {


	return class extends React.Component {

		static displayName = 'SimpleIntegerPickerDecorator';

		static contextTypes = contextTypes;

		constructor(props) {
			super(props);
			this.state = {
				isClicked: false,
				value : 0
			};
			this.getInputNode = this.getInputNode.bind(this);
			this.handleChange = this.handleChange.bind(this);
			this.handleClick = this.handleClick.bind(this);
			this.handleBlur = this.handleBlur.bind(this);
			this.handleDown = this.handleDown.bind(this);
			this.prepareInput = this.prepareInput.bind(this);
			this.inputChangeHandler = this.inputChangeHandler.bind(this);
		}

		validateValue (value) {
			return (value <= this.props.max) && (value >= this.props.min) ? value : this.state.value;
		}

		handleChange (ev) {
			this.setState({
				value: this.validateValue(parseInt(ev.value))
			});
			forwardChange({value: this.validateValue(parseInt(ev.value))}, this.props);
		}

		prepareInput () {
			this.setState({
				isClicked: true
			});
		}

		focusInput (node) {
			let inputComp = node.querySelector('input');
			inputComp.focus();
		}

		inputChangeHandler (ev) {
			if (ev.keyCode === 13 || ev.keyCode === 27 || ev.keyCode === 38 || ev.keyCode === 40) {
				this.handleBlur(ev);
			}
		}

		handleClick (ev, props) {
			ev.persist();
			this.SIP = ev.currentTarget;
			Spotlight.pause();
			Spotlight.setPointerMode(false);
			Spotlight.focus(this.SIP);
			if (!this.props.disabled && ev.target.className.indexOf('tapArea') > -1 ) {
				this.prepareInput();
			}
		}

		getInputNode (node) {
			this.inputNode = ReactDOM.findDOMNode(node);
			if (this.inputNode) this.focusInput(this.inputNode);
			forwardClick({isClicked : this.state.isClicked}, this.props);
		}

		handleDown (ev) {
			let keyCode = ev.keyCode;

			if (keyCode === 13) {
				this.setState({
					isClicked : !this.state.isClicked
				});
			} else if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105) || (keyCode === 107 || keyCode === 109)) {
				this.prepareInput();
			} else {
				return;
			}
		}

		handleBlur (ev) {
			this.setState({
				value: this.validateValue(parseInt(ev.target.value)),
				isClicked: false
			});
			Spotlight.resume();
			Spotlight.setPointerMode(true);
			forwardBlur({value: this.validateValue(parseInt(ev.target.value))}, this.props);
		}

		render () {
			const props = Object.assign({}, this.props);

			return (
			<Wrapped
				newValue={this.state.value}
				inputRef={this.getInputNode}
				onChangeHandler={this.handleChange}
				onClickHandler={this.handleClick}
				inputChange={this.inputChangeHandler}
				onBlurHandler={this.handleBlur}
				enableInput={this.state.isClicked}
				onKeyDown={this.handleDown}
				{...props}
			/>
			)
		}
	}
});

export default SimpleIntegerPickerDecorator;
export {SimpleIntegerPickerDecorator};
