import R from 'ramda';
import React, {PropTypes} from 'react';
import kind from 'enyo-core/kind';

import Repeater from '../Repeater';

import {Groupable, pickGroupableProps} from './Groupable';

const propTypes = {
	onActivate: PropTypes.func.isRequired,
	activate: PropTypes.string,
	index: PropTypes.number,
	selectedProp: PropTypes.string
};

const internalProps = R.keys(propTypes);

const GroupBase = kind({
	name: 'Group',

	propTypes: {
		...Repeater.propTypes,
		...propTypes
	},

	defaultProps: {
		...Repeater.defaultProps,
		activate: 'onClick',
		selectedProp: 'data-selected',
		index: 0
	},

	computed: {
		itemProps: R.converge(R.merge, [
			pickGroupableProps,
			R.prop('itemProps')
		])
	},

	render: (props) => {
		const rest = R.omit(internalProps, props);
		return <Repeater {...rest} type={Groupable} />;
	}
});

class Group extends React.Component {
	static propTypes = {
		...R.omit(['index', 'onActivate'], GroupBase.propTypes),
		defaultIndex: PropTypes.number,
		onSelectedChange: PropTypes.func
	}

	static defaultProps = {
		defaultIndex: 0
	}

	constructor (props) {
		super(props);
		this.state = {index: props.defaultIndex};
	}

	handleActivate = ({index, data}) => {
		if (index !== this.state.index) {
			if (this.props.onSelectedChange) this.props.onSelectedChange({index, data});
			this.setState({index});
		}
	}

	render () {
		const props = R.omit(['onSelectedChange', 'defaultIndex'], this.props);
		return <GroupBase {...props} index={this.state.index} onActivate={this.handleActivate} />;
	}
}

export default Group;
export {Group, GroupBase, Groupable};
