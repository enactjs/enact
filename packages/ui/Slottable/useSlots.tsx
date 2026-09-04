import {createElement, isValidElement, Children, ReactNode, ReactElement} from 'react';
import warning from 'warning';

export interface ChildConfig {
	children?: ReactNode;
	[key: string]: any;
}

export interface DistributedChild {
	props: {
		children?: ReactNode;
		slot?: string;
	}
	type: string | {
		name?: string;
		displayName?: string;
		defaultSlot?: string;
	}
}

// ** WARNING ** This is an intentional but likely dangerous hack necessary to clone a child while
// omitting the `slot` property. It relies on the black box structure of a React element which could
// change breaking this code. Without it, the slot property will cascade to a DOM node causing a
// React warning.
function cloneElement (child: ReactElement, index: number) {
	const newProps = Object.assign({}, child.props) as Record<string, any>;
	delete newProps.slot;
	newProps.key = `slot-${index}`;

	return createElement(child.type, newProps);
}

function distributeChild (child: ReactNode, index: number, slots: string[], props: Record<string, any>) {
	if (!isValidElement(child)) {
		return false;
	}

	let c: ReactNode;
	let slot: string | undefined;
	const element = child as unknown as DistributedChild;
	const hasSlot = (name?: string) => name ? slots.indexOf(name) !== -1 : false;

	if (element.props.slot) {
		const hasUserSlot = hasSlot(slot = element.props.slot);
		warning(hasUserSlot, 'The slot "%s" specified on %s does not exist', element.props.slot,
			typeof element.type === 'string' ? element.type : (element.type.name || element.type.displayName || 'component')
		);

		if (hasUserSlot) {
			c = cloneElement(child, index);
		}
	} else if (typeof element.type !== 'string' && hasSlot(slot = element.type.defaultSlot)) {
		c = child;
	} else if (typeof element.type === 'string' && hasSlot(slot = element.type)) {
		const propNames = Object.keys(element.props);
		if (propNames.length === 1 && propNames[0] === 'children') {
			c = element.props.children;
		} else {
			c = child;
		}
	}

	if (c) {
		if (slot) {
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
		}

		return true;
	}

	return false;
}

function distribute ({children, ...slots}: ChildConfig): ChildConfig {
	const slotNames = Object.keys(slots);
	const props = {
		children
	};

	if (slotNames.length > 0) {
		const remaining: ReactNode[] = [];
		Children.forEach(children, (child: ReactNode, index) => {
			if (!distributeChild(child, index, slotNames, props)) {
				remaining.push(child);
			}
		});

		// we need to retain the children prop so that it can overwrite the value from props if the
		// author spreads the return of useSlots over props
		props.children = remaining.length === 0 ? null : remaining;
	}

	slotNames.forEach(slot => {
		if (slots[slot] === undefined) { // eslint-disable-line no-undefined
			delete slots[slot];
		}
	});

	// We handle fallback here (rather than at the props initialization) because distributeChild
	// will append to existing props and we want the distributed value to override the fallback
	// value.
	return {
		...slots,
		...props
	};
}

/**
 * Configuration for `useSlots`
 *
 * @typedef {Object} useSlotsConfig
 * @memberof ui/Slottable
 * @property {Object} [slots] An object mapping slot names to default values. It must contain a
 *                            `children` key with an array of elements to be distributed into slots.
 * @private
 */

/**
 * Distributes `children` into the configured `slots`.
 *
 * `useSlots` iterates over all the `children` in `props` and distributes any children based on
 * the following rules:
 *
 * * If the child has a `slot` property matching a valid slot, or
 * * If the component for the child has the `defaultSlot` static member matching a valid slot, or
 * * If the child component's type is a string matching a valid slot.
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
 * function Component ({after, before, children, label, ...rest}) {
 *   const slots = useSlots({after, before, children, label});
 *
 *   return (
 *     <div {...rest} aria-label={label}>
 *       <span class="before">{slots.before}</span>
 *       {slots.children}
 *       <span class="after">{slots.after}</span>
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
function useSlots (config: ChildConfig) {
	return distribute(config);
}

export default useSlots;
export {
	useSlots
};
