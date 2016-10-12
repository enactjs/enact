import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import Expandable from '../Expandable';
import Item from '../Item';

import {Spottable} from '@enact/spotlight';

const isSelected = function (selected, index) {
	return index === selected || Array.isArray(selected) && selected.includes(index);
};

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
		onSelect: PropTypes.func,

		/**
		 * Index or array of indices of the selected item(s)
		 *
		 * @type {Number}
		 * @public
		 */
		selected: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),

		/**
		 * Name of `boolean` property to set on `childComponent` when an item is selected
		 *
		 * @type {String}
		 * @public
		 */
		selectedProp: PropTypes.string
	},

	defaultProps: {
		childComponent: Item
	},

	computed: {
		children: ({children, childComponent, onSelect, selected, selectedProp}) => {
			// Wrap established elements in only a div (for event and key wiring) instead of using
			// the childComponent. This only affects children that are qualified elements, not
			// arrays of strings. Arrays of strings still use the provided childComponent.
			const onlyStringChild = typeof React.Children.toArray(children)[0] === 'string';
			const Component = onlyStringChild ? childComponent : SpottableDiv;

			return React.Children.map(children, (item, index) => {
				const value = (typeof item === 'string') ? item : item.props.value;
				const itemProps = {
					children: item,
					key: index,
					onClick: null
				};

				if (onSelect) {
					itemProps.onClick = () => onSelect({value, selected: index});
				}

				if (selectedProp) {
					itemProps[selectedProp] = isSelected(selected, index);
				}

				return <Component {...itemProps} />;
			});
		}
	},

	render: (props) => {
		delete props.childComponent;
		delete props.onSelect;
		delete props.selected;
		delete props.selectedProp;

		return <div {...props} />;
	}
});

const ExpandableList = Expandable({
	close: 'onSelect'
}, ExpandableListBase);

export default ExpandableList;
export {ExpandableList, ExpandableListBase};
