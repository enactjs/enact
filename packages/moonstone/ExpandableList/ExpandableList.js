import React, {PropTypes} from 'react';
import kind from '@enact/core/kind';

import Expandable from '../Expandable';
import Item from '../Item';

import {Spottable} from '@enact/spotlight';

const SpottableDiv = Spottable('div');

const ExpandableListBase = kind({
	name: 'ExpandableList',

	propTypes: {
		/**
		 * The tag name or component instance to be used as a template for members of the expandable
		 * list when the children are strings (not components).
		 *
		 * @type {String|Component}
		 * @default [moonstone/Item]
		 * @public
		 */
		childComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),

		/**
		 * Called when an item is selected
		 *
		 * @type {Function}
		 * @public
		 */
		onChange: PropTypes.func
	},

	defaultProps: {
		childComponent: Item
	},

	computed: {
		// Wrap established elements in only a div (for event and key wiring) instead of using the childComponent.
		// This only affects children that are qualified elements, not arrays of strings.
		// Arrays of strings still use the provided childComponent
		ItemType: ({children, childComponent}) => ((children && children[0] && typeof children[0] === 'string') ? childComponent : SpottableDiv)
	},

	render: ({children, onChange, ItemType, ...rest}) => {
		delete rest.childComponent;

		return (
			<div {...rest}>
				{React.Children.map(children, (item, index) => {
					const value = (typeof item === 'string') ? item : item.props.value;
					let handler = null;

					if (onChange) handler = () => onChange({value, index});

					return (
						<ItemType onClick={handler} key={index}>
							{item}
						</ItemType>
					);
				})}
			</div>
		);
	}
});

const ExpandableList = Expandable({
	close: 'onChange'
}, ExpandableListBase);

export default ExpandableList;
export {ExpandableList, ExpandableListBase};
