/**
 * Provides a higher-order component that render child components into pre-designated slots.
 *
 * See [SlotItem]{@link ui/SlotItem.SlotItemDecorator} for the use of `Slottable`.
 *
 * @module ui/Slottable
 * @exports Slottable
 */

import React from 'react';
import warning from 'warning';

// ** WARNING ** This is an intentional but likely dangerous hack necessary to clone a child while
// omitting the `slot` property. It relies on the black box structure of a React element which could
// change breaking this code. Without it, the slot property will cascade to a DOM node causing a
// React warning.
function cloneElement (child) {
	const newProps = Object.assign({}, child.props);
	delete newProps.slot;

	return React.createElement(child.type, newProps);
}

function distributeChild (child, index, slots, props) {
	let c, slot;
	const hasSlot = (name) => slots.indexOf(name) !== -1;

	if (!React.isValidElement(child)) {
		return false;
	} else if (child.props.slot) {
		const hasUserSlot = hasSlot(slot = child.props.slot);
		warning(hasUserSlot, 'The slot "%s" specified on %s does not exist', child.props.slot,
			typeof child.type === 'string' ? child.type : (child.type.name || child.type.displayName || 'component')
		);

		if (hasUserSlot) {
			c = cloneElement(child);
		}
	} else if (hasSlot(slot = child.type.defaultSlot)) {
		c = child;
	} else if (hasSlot(slot = child.type)) {
		const propNames = Object.keys(child.props);
		if (propNames.length === 1 && propNames[0] === 'children') {
			c = child.props.children;
		} else {
			c = child;
		}
	}

	if (c) {
		let prop = props[slot];
		if (prop) {
			if (Array.isArray(prop)) {
				prop.push(c);
			} else {
				prop = [prop, c];
			}
		} else {
			prop = c;
		}
		props[slot] = prop;

		return true;
	}

	return false;
}

function distribute (slots, children) {
	const props = {
		children
	};

	if (slots) {
		const remaining = [];
		React.Children.forEach(children, (child, index) => {
			if (!distributeChild(child, index, slots, props)) {
				remaining.push(child);
			}
		});

		if (remaining.length > 0) {
			props.children = remaining;
		} else {
			delete props.children;
		}
	}

	return props;
}

/**
 * A higher-order component that allows wrapped components to separate children into pre-designated 'slots'.
 *
 * To use `Slottable`, you must configure it by passing in a config object with the `slots` member set to an
 * array of slot names.  Any children whose `slot` or `defaultSlot` property matches a named slot or whose
 * type matches a named slot will be placed into a property of the same name on the wrapped component.
 *
 * @class Slottable
 * @memberof ui/Slottable
 * @hoc
 * @public
 */
function useSlots (config = {}) {
	const {slots, children} = config;

	return distribute(slots, children);
}

export default useSlots;
export {
	useSlots
};
