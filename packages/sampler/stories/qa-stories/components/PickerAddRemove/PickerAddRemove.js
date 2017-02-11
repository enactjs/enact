import React from 'react';

import {Picker} from '@enact/moonstone/Picker';
import {Input} from '@enact/moonstone/Input';
import Button from '@enact/moonstone/Button';
import Changeable from '@enact/ui/Changeable';

const StatefulPicker = Changeable(Picker);
const StatefulInput = Changeable({mutable: true}, Input);

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

		this.value = '';
		this.index = 0;
		this.state = {
			children: {}
		};
	}

	componentWillUpdate () {
	}

	handleAdd = () => {
		const children = this.state.children,
			index = this.index,
			value = this.value || 'sample' + (children ? children.length : 0),
			newChild = {};

		newChild[index] = value;
		const newChildren = Object.assign({}, children, newChild);

		this.setState({
			children: newChildren
		});
	}

	handleRemove = () => {
		const children = Object.assign({}, this.state.children),
			index = this.index;
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
		this.index = index;
	}

	handleValueChange = ({value}) => {
		this.value = value;
	}

	render () {
		const pickerChildren = Object.values(this.state.children);

		return (
			<div>
				<div>
					<StatefulPicker {...this.props}>
						{pickerChildren}
					</StatefulPicker>
				</div>
				<div>
					<StatefulInput
						onChange={this.handleValueChange}
						placeholder="value"
					/>
				</div>
				<div>
					<StatefulInput
						onChange={this.handleIndexChange}
						placeholder="index"
					/>
				</div>
				<Button onClick={this.handleAdd}>
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
