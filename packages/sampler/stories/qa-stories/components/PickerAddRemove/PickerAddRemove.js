import React from 'react';

import Picker from '@enact/moonstone/Picker';
import Input from '@enact/moonstone/Input';
import Button from '@enact/moonstone/Button';

class PickerAddRemove extends React.Component {
	static displayName: 'PickerAddRemove'

	static propTypes = {
		disabled: React.PropTypes.bool,
		joined: React.PropTypes.bool,
		noAnimation: React.PropTypes.bool,
		orientation: React.PropTypes.string,
		width: React.PropTypes.string,
		wrap: React.PropTypes.bool
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
			inputValue: ''
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
		const pickerChildren = Object.values(this.state.children);

		return (
			<div>
				<div>
					<Picker
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
