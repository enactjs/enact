/**
 * Exports the {@link ui/Slottable.Slottable} Higher-order Component (HOC).
 *
 * @module ui/Slottable
 */

import {kind, hoc} from '@enact/core';
import R from 'ramda';
import React from 'react';
import warning from 'warning';

// ** WARNING ** This is an intentional but likely dangerous hack necessary to clone a child while
// omitting the `slot` property. It relies on the black box structure of a React element which could
// change breaking this code. Without it, the slot property will cascade to a DOM node causing a
// React warning.
const cloneElement = (child, props, omit) => {
	if (omit && R.has(omit, child.props)) {
		return React.createElement(child.type, R.merge(R.dissoc(omit, child.props), props));
	}

	return child;
};

const distributeChild = (child, index, slots, props) => {
	let c, slot;
	const hasSlot = R.contains(R.__, slots);

	if (!React.isValidElement(child)) {
		return false;
	} else if (child.props.slot) {
		const hasUserSlot = hasSlot(slot = child.props.slot);
		warning(hasUserSlot, 'The slot "%s" specified on %s does not exist', child.props.slot,
			typeof child.type === 'string' ? child.type : (child.type.name || child.type.displayName || 'component')
		);
		c = hasUserSlot && cloneElement(child, {key: index}, 'slot');
	} else if (hasSlot(slot = child.type.defaultSlot)) {
		c = child;
	} else if (hasSlot(slot = child.type)) {
		c = child.props.children;
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
};

const distribute = function (slots, props) {
	if (slots) {
		const children = [];
		const adjusted = {...props};
		React.Children.forEach(props.children, (child, index) => {
			if (!distributeChild(child, index, slots, adjusted)) {
				children.push(child);
			}
		});

		adjusted.children = children.length > 0 ? children : null;
		return adjusted;
	}

	return props;
};

const defaultConfig = {
	slots: null
};

/**
 * {@link ui/Slottable.Slottable} is a Higher-order Component that allows wrapped components to
 * separate children into pre-designated 'slots'.  To use Slottable, you must configure it by passing in
 * a config object with the `slots` member set to an array of slot names.  Any children whose
 * `slot` or `defaultSlot` property matches a named slot or whose type matches a named slot will be placed
 * into a property of the same name on the wrapped component.
 *
 * @class Slottable
 * @memberof ui/Slottable
 * @ui
 * @public
 */
const Slottable = hoc(defaultConfig, (config, Wrapped) => {
	const slots = config.slots;
	return kind({
		name: 'Slottable',
		render: (props) => {
			const adjusted = distribute(slots, props);
			return (
				<Wrapped {...adjusted} />
			);
		}
	});
});

export default Slottable;
export {Slottable};
