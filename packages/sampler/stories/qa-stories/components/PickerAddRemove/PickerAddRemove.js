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
		this.state = {
			children: props.children
		};
	}

	handleAdd = () => {
		const value = this.value,
			index = this.index;
		let children = this.state.children;

		children.splice(index.state.value, 0, value.state.value);

		this.setState({
			children: children
		});
	}

	handleRemove = () => {
		const index = parseInt(this.index.state.value);
		this.setState({
			children: [
				...this.state.children.slice(0, index),
				...this.state.children.slice(index + 1)
			]
		});
	}

	render () {
		return (
			<div>
				<div>
					<StatefulPicker {...this.props}>
						{this.state.children}
					</StatefulPicker>
				</div>
				<div>
					<StatefulInput
						ref={(c) => {
							this.value = c;
						}}
						placeholder='Value'
					/>
				</div>
				<div>
					<StatefulInput
						ref={(c) => {
							this.index = c;
						}}
						placeholder='Index'
					/>
				</div>
				<Button onClick={this.handleAdd}>
					Add
				</Button>
				<Button onClick={this.handleRemove}>
					Remove
				</Button>
			</div>
		);
	}
}

export default PickerAddRemove;
