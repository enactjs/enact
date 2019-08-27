import kind from '@enact/core/kind';
import hoc from '@enact/core/hoc';
import EnactPropTypes from '@enact/core/internal/prop-types';
import Spotlight from '@enact/spotlight';
import ri from '@enact/ui/resolution';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';
import ReactDOM from 'react-dom';

import Item from '../Item';
import Skinnable from '../Skinnable';
import VirtualList from '../VirtualList';

import css from './Dropdown.module.less';

const scrollOffset = 2;

const isSelectedValid = ({children, selected}) => Array.isArray(children) && children[selected] != null;

const DropdownListBase = kind({
	name: 'DropdownListBase',

	propTypes: {
		/*
		* The selections for Dropdown
		*
		* @type {String[]|Array.<{key: (Number|String), children: (String|Component)}>}
		*/
		children: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.string),
			PropTypes.arrayOf(PropTypes.shape({
				children: EnactPropTypes.renderable.isRequired,
				key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
			}))
		]),

		/*
		* Called when an item is selected.
		*
		* @type {Function}
		*/
		onSelect: PropTypes.func,

		/*
		* Callback function that will receive the scroller's scrollTo() method
		*
		* @type {Function}
		*/
		scrollTo: PropTypes.func,

		/*
		* Index of the selected item.
		*
		* @type {Number}
		*/
		selected: PropTypes.number,

		/*
		 * State of possible skin variants.
		 *
		 * Used to scale the `itemSize` of the `VirtualList` based on large-text mode
		 *
		 * @type {Object}
		 */
		skinVariants: PropTypes.object,

		/*
		* The width of DropdownList.
		*
		* @type {('huge'|'large'|'medium'|'small'|'tiny')}
		*/
		width: PropTypes.oneOf(['tiny', 'small', 'medium', 'large', 'huge'])
	},

	styles: {
		css,
		className: 'dropDownList'
	},

	handlers: {
		itemRenderer: ({index, ...rest}, {children, onSelect}) => {
			let child = children[index];
			if (typeof child === 'string') {
				child = {children: child};
			}

			return (
				<Item
					{...rest}
					{...child}
					// eslint-disable-next-line react/jsx-no-bind
					onClick={() => onSelect({selected: index})}
				/>
			);
		}
	},

	computed: {
		className: ({width, styler}) => styler.append(width),
		dataSize: ({children}) => children ? children.length : 0,
		itemSize: ({skinVariants}) => ri.scale(skinVariants && skinVariants.largeText ? 72 : 60)
	},

	render: ({dataSize, itemSize, scrollTo, ...rest}) => {
		delete rest.children;
		delete rest.onSelect;
		delete rest.selected;
		delete rest.skinVariants;
		delete rest.width;

		return (
			<VirtualList
				{...rest}
				cbScrollTo={scrollTo}
				dataSize={dataSize}
				itemSize={itemSize}
				style={{height: itemSize * dataSize}}
			/>
		);
	}
});

const DropdownListSpotlightDecorator = hoc((config, Wrapped) => {
	return class extends React.Component {
		static displayName = 'DropdownListSpotlightDecorator'

		static propTypes = {
			/*
			* Index of the selected item.
			*
			* @type {Number}
			*/
			selected: PropTypes.number
		}

		componentDidMount () {
			// eslint-disable-next-line react/no-find-dom-node
			this.node = ReactDOM.findDOMNode(this);
			Spotlight.set(this.node.dataset.spotlightId, {leaveFor: {up: '', down: ''}});
			this.isScrolledIntoView = false;
		}

		componentDidUpdate () {
			this.scrollIntoView();
		}

		getNodeToFocus = (selected) => {
			const scrollIndex = selected > scrollOffset ? selected - scrollOffset : 0;

			return {
				nodeToFocus: this.node.querySelector(`[data-index='${selected}']`),
				nodeToScroll: this.node.querySelector(`[data-index='${scrollIndex}']`)
			};
		}

		getScrollTo = (scrollTo) => {
			this.scrollTo = scrollTo;
		}

		scrollIntoView = () => {
			if (!this.isScrolledIntoView) {
				if (isSelectedValid(this.props)) {
					const {nodeToFocus, nodeToScroll} = this.getNodeToFocus(this.props.selected);

					this.scrollTo({animate: false, node: nodeToScroll});
					Spotlight.focus(nodeToFocus);
				}
				this.isScrolledIntoView = true;
			}
		}

		render () {
			return (
				<Wrapped {...this.props} scrollTo={this.getScrollTo} />
			);
		}
	};
});

const DropdownListDecorator = compose(
	DropdownListSpotlightDecorator,
	Skinnable({variantsProp: 'skinVariants'})
);

const DropdownList = DropdownListDecorator(DropdownListBase);

export default DropdownList;
export {
	DropdownList,
	DropdownListBase,
	isSelectedValid
};
