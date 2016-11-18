import React from 'react';

import {Picker, PickerBase} from '@enact/moonstone/Picker';
import {Input, InputBase} from '@enact/moonstone/Input';
import Button from '@enact/moonstone/Button';
import Changeable from '@enact/ui/Changeable';

const StatefulPicker = Changeable(Picker);
StatefulPicker.propTypes = Object.assign({}, PickerBase.propTypes, StatefulPicker.propTypes);
StatefulPicker.defaultProps = Object.assign({}, PickerBase.defaultProps, StatefulPicker.defaultProps);
StatefulPicker.displayName = 'Picker';

const StatefulInput = Changeable({mutable: true}, Input);
StatefulInput.propTypes = Object.assign({}, InputBase.propTypes, Input.propTypes);
StatefulInput.defaultProps = Object.assign({}, InputBase.defaultProps, Input.defaultProps);
StatefulInput.displayName = 'Input';

const PickerAddRemove = class extends React.Component {
	static displayName: 'PickerAddRemove'

	static propTypes = {
		list: React.PropTypes.array,
		orientation: React.PropTypes.string,
		wrap: React.PropTypes.bool,
		joined: React.PropTypes.bool,
		noAnimation: React.PropTypes.bool,
		disabled: React.PropTypes.bool
	}

	static defaultProps = {
		orientation: 'horizontal',
		wrap: false,
		joined: false,
		noAnimation: false,
		disabled: false
	}

	constructor (props) {
		super(props);
		this.state = {
			list: props.list
		};
	}

	handleClick = () => {
		var values = this.state.list;
		values.push(this.refs.textInput.state.value);
		this.setState({list: values});
	}

	render () {
		return (
			<div>
				<StatefulPicker
					width={'medium'}
					orientation={this.props.orientation}
					wrap={this.props.wrap}
					joined={this.props.joined}
					noAnimation={this.props.noAnimation}
					disabled={this.props.disabled}
				>
					{this.state.list}
				</StatefulPicker>
				<div>
					<StatefulInput ref='textInput'>
					</StatefulInput>
					<Button onClick={this.handleClick.bind(this)}>
						Add
					</Button>
				</div>
			</div>
		);
	}
}

export default PickerAddRemove;
export {PickerAddRemove as PickerAddRemove};
