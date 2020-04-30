import React from 'react';
import warning from 'warning';

// ** WARNING ** This is an intentional but likely dangerous hack necessary to clone a child while
// omitting the `slot` property. It relies on the black box structure of a React element which could
// change breaking this code. Without it, the slot property will cascade to a DOM node causing a
// React warning.
function cloneElement (child, index) {
	const newProps = Object.assign({}, child.props);
	delete newProps.slot;
	newProps.key = `slot-${index}`;

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
			c = cloneElement(child, index);
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

function distribute (slots, {children, ...fallback}) {
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

	// We handle fallback here (rather than at the props initialization) because distributeChild
	// will append to existing props and we want the distributed value to override the fallback
	// value.
	return {
		...fallback,
		...props
	};
}

/**
 * Configuration for `useSlots`
 *
 * @typedef {Object} useSlotsConfig
 * @memberof ui/Slottable
 * @property {String[]} [slots] List of slot names
 * @property {Object}   [props] Props object
 * @private
 */

/**
 * Distributes `children` into the configured `slots`.
 *
 * `useSlots` iterates over all of the `children` in `props` and distributes any children based on
 * the followig rules:
 *
 * * If the child has a `slot` property matching a valid slot, or
 * * If the component for the child has the `defaultSlot` static member matching a valid slot, or
 * * If the child component is a string matching a valid slot.
 *
 * When a child matches one of the above rules, it is removed from children and inserted into a prop
 * matching the name of the slot.
 *
 * *Special Conditions*
 *
 * * If multiple children match the same slot, the destination prop will be an array of children.
 * * If a value exists on `props` but not as a slot within `children`, the prop value is used as a
 *   fallback.
 * * If a value exists both on `props` and as a slot within `children`, the slot value(s) replaces
 *   the prop value.
 *
 * ```
 * function Component (props) {
 *   const {before, after, children} = useSlots({slots: ['before', 'after', 'label'], props});
 *
 *   return (
 *     <div {...rest} aria-label={label}>
 *       <span class="before">{before}</span>
 *       {children}
 *       <span class="after">{after}</span>
 *     </div>
 *   );
 * }
 *
 * <Component label="descriptive label">
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
	const {slots, props} = config;

	return distribute(slots, props);
}

export default useSlots;
export {
	useSlots
};
