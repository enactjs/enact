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
 * Configuration for `useSlots`
 *
 * @typedef {Object} useSlotsConfig
 * @memberof ui/Slottable
 * @property {String[]} [slots]    List of slot names
 * @property {Node}     [children] Nodes to distribute into the slots
 * @private
 */

/**
 * Distributes `children` into the configured `slots`.
 *
 * ```
 * function Component ({children: original, ...rest}) {
 *   const {before, after, children} = useSlots({slots: ['before', 'after'], original});
 *
 *   return (
 *     <div {...rest}>
 *       <span class="before">{before}</span>
 *       {children}
 *       <span class="after">{after}</span>
 *     </div>
 *   );
 * }
 *
 * <Component>
 *   <Icon slot="before">star</Icon>
 *   Some other content
 *   <Icon slot="after">flag</Icon>
 * </Component>
 * ```
 *
 * @param {useSlotsConfig} config Configuration options
 * @returns {Object} A object whose keys are the slot names and values are the nodes from
 *                   `children`. If any nodes were not assigned to a slot, they will be returned in
 *                   the `children` prop. If no nodes remain, the `children` prop will be omitted.
 * @memberof ui/Slottable
 * @private
 */
function useSlots (config = {}) {
	const {slots, children} = config;

	return distribute(slots, children);
}

export default useSlots;
export {
	useSlots
};
