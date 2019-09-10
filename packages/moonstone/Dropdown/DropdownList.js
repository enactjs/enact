import kind from '@enact/core/kind';
import {forward} from '@enact/core/handle';
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
		 * @type {('huge'|'x-large'|'large'|'medium'|'small'|'tiny')}
		 */
		width: PropTypes.oneOf(['tiny', 'small', 'medium', 'large', 'x-large', 'huge'])
	},

	styles: {
		css,
		className: 'dropDownList'
	},

	handlers: {
		itemRenderer: ({index, ...rest}, props) => {
			const {children, selected} = props;

			let child = children[index];
			const data = child;
			if (typeof child === 'string') {
				child = {children: child};
			}

			return (
				<Item
					{...rest}
					{...child}
					data-selected={index === selected}
					// eslint-disable-next-line react/jsx-no-bind
					onClick={() => forward('onSelect', {data, selected: index}, props)}
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

const ReadyState = {
	// Initial state. Scrolling and focusing pending
	INIT: 0,
	// Scroll requested
	SCROLLED: 1,
	// Focus completed or not required
	DONE: 2
};

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

		constructor (props) {
			super(props);

			this.state = {
				ready: isSelectedValid(props) ? ReadyState.INIT : ReadyState.DONE
			};
		}

		componentDidMount () {
			// eslint-disable-next-line react/no-find-dom-node
			this.node = ReactDOM.findDOMNode(this);
			Spotlight.set(this.node.dataset.spotlightId, {
				defaultElement: '[data-selected="true"]',
				enterTo: 'default-element',
				leaveFor: {up: '', down: ''}
			});
		}

		componentDidUpdate () {
			if (this.state.ready === ReadyState.INIT) {
				this.scrollIntoView();
			} else if (this.state.ready === ReadyState.SCROLLED) {
				this.focusSelected();
			}
		}

		setScrollTo = (scrollTo) => {
			this.scrollTo = scrollTo;
		}

		scrollIntoView = () => {
			const {selected} = this.props;
			let ready = ReadyState.DONE;

			if (isSelectedValid(this.props)) {
				const index = selected > scrollOffset ? selected - scrollOffset : 0;

				this.scrollTo({animate: false, index});
				ready = ReadyState.SCROLLED;
			}

			this.setState({ready});
		}

		focusSelected () {
			if (Spotlight.focus(this.node.dataset.spotlightId)) {
				this.setState({ready: ReadyState.DONE});
			}
		}

		render () {
			return (
				<Wrapped {...this.props} scrollTo={this.setScrollTo} />
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
