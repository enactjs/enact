import R from 'ramda';
import React from 'react';
import {kind, hoc} from 'enyo-core';

// ** WARNING ** This is an intentional but likely dangerous hack necessary to clone a child while
// omitting the `slot` property. It relies on the black box structure of a React element which could
// change breaking this code. Without it, the slot property will cascade to a DOM node causing a
// React warning.
const cloneElementWithoutProps = (child, props, omit) => {
	return React.createElement(child.type, R.merge(R.omit(omit, child.props), props));
};

class SlottableChildren {
	constructor (children) {
		this.slots = {};
		React.Children.forEach(children, (child, index) => {
			const el = cloneElementWithoutProps(child, {key: index}, ['slot']);
			const slot = child.props.slot || '*';

			if (!this.slots[slot]) this.slots[slot] = [];
			this.slots[slot].push(el);
		});
	}
	distribute (slot = '*') {
		const children = this.slots[slot];

		if (children) {
			delete this.slots[slot];
			return children;
		}

		return null;
	}
}

const defaultConfig = {
	prop: 'slottable'
};

const Slottable = hoc(defaultConfig, (config, Wrapped) => {
	return kind({
		name: 'Slottable',
		computed: {
			[config.prop]: ({children}) => new SlottableChildren(children)
		},
		render: (props) => (
			<Wrapped {...props} />
		)
	});
});

const Slot = kind({
	defaultProps: {
		component: 'span'
	},
	computed: {
		slotted: ({name, children}) => children.distribute(name)
	},
	render: ({component: Component, slotted, ...rest}) => {
		delete rest.name;
		return (
			<Component {...rest}>{slotted}</Component>
		);
	}
});

export {Slot, Slottable};
