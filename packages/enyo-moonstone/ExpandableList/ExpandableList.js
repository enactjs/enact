import kind from 'enyo-core/kind';
import React, {PropTypes} from 'react';

import Expandable from '../Expandable';
import Item from '../Item';

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
		childTag: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),

		/**
		 * Called when an item is selected
		 *
		 * @type {Function}
		 * @public
		 */
		onChange: PropTypes.func
	},

	defaultProps: {
		childTag: Item
	},

	computed: {
		// Wrap established elements in only a div (for event and key wiring) instead of using the childTag.
		// This only affects children that are qualified elements, not arrays of strings.
		// Arrays of strings still use the provided childTag
		ItemType: ({children, childTag}) => ((children && children[0] && typeof children[0] === 'string') ? childTag : 'div')
	},

	render: ({children, onChange, ItemType, ...rest}) => {
		delete rest.childTag;

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
