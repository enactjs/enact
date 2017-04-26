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
			children: [],
			inputIndex: 0,
			inputValue: ''
		};
	}

	handleAddReplace = () => {
		let children = this.state.children,
			index = this.state.inputIndex,
			value = this.state.inputValue || 'sample ' + index;
			// newChild = {};

		// newChild[index] = value;
		children.splice(index, 0, value);

		this.setState({
			children: children,
			inputIndex: this.state.inputIndex + 1,
			inputValue: ''
		});
	}

	handleRemove = () => {
		let children = this.state.children;
		const index = this.state.inputIndex;

		children.splice(index, 1);


		this.setState({
			children: children
		});
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
		// const pickerChildren = Object.values(this.state.children);

		return (
			<div>
				<div>
					<Picker
						{...this.props}
					>
						{this.state.children}
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
