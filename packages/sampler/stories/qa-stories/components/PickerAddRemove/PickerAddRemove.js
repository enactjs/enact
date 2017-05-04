import Picker from '@enact/moonstone/Picker';
import Input from '@enact/moonstone/Input';
import Button from '@enact/moonstone/Button';
import React from 'react';
import PropTypes from 'prop-types';

class PickerAddRemove extends React.Component {
	static displayName: 'PickerAddRemove'

	static propTypes = {
		disabled: PropTypes.bool,
		joined: PropTypes.bool,
		noAnimation: PropTypes.bool,
		orientation: PropTypes.string,
		width: PropTypes.string,
		wrap: PropTypes.bool
	}

	static defaultProps = {
		disabled: false,
		joined: false,
		noAnimation: false,
		orientation: 'horizontal',
		width: 'medium',
		wrap: false
	}

	constructor (props) {
		super(props);

		this.state = {
			children: {
				0 : ''
			},
			inputIndex: 0,
			inputValue: '',
			value: 0
		};
	}

	handleAddReplace = () => {
		const children = this.state.children,
			index = this.state.inputIndex,
			value = this.state.inputValue || 'sample ' + index,
			newChild = {};

		newChild[index] = value;
		const newChildren = Object.assign({}, children, newChild);

		this.setState({
			children: newChildren,
			inputIndex: this.state.inputIndex + 1,
			inputValue: ''
		});
	}

	handleRemove = () => {
		const children = Object.assign({}, this.state.children),
			index = this.state.inputIndex;
		delete children[index];

		this.setState({
			children: children,
			value: this.state.value === 0 ? 0 : this.state.value - 1
		});
	}

	handleValueUpdate = ({value}) => {
  		this.setState({value: value});
 	}

	handleIndexChange = ({value}) => {
		let index = parseInt(value);
		if (isNaN(index)) {
			index = 0;
		}
		this.setState({inputIndex: index});
	}

	handleValueChange = ({value}) => {
		this.setState({inputValue: value});
	}

	render () {
		const pickerChildren = Object.values(this.state.children);

		return (
			<div>
				<div>
					<Picker
						onChange={this.handleValueUpdate}
						value={this.state.value}
						{...this.props}
					>
						{pickerChildren}
					</Picker>
				</div>
				<div>
					Value:
					<Input
						onChange={this.handleValueChange}
						placeholder="value"
						value={this.state.inputValue}
					/>
				</div>
				<div>
					Index:
					<Input
						onChange={this.handleIndexChange}
						placeholder="index"
						value={this.state.inputIndex}
					/>
				</div>
				<Button onClick={this.handleAddReplace}>
					Add/Replace
				</Button>
				<Button onClick={this.handleRemove}>
					Remove
				</Button>
			</div>
		);
	}
}

export default PickerAddRemove;
