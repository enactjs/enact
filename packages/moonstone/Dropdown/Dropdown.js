/**
 * Moonstone styled Dropdown components
 *
 * @example
 * <Dropdown
 * 		defaultSelected={2}
 *		inline
 *		title="Dropdown"
 * >
 *   {['Option 1', 'Option 2', 'Option 3', 'Option 4']}
 * </Dropdown>
 *
 * @module moonstone/Dropdown
 * @exports Dropdown
 * @exports DropdownBase
 * @exports DropdownBaseDecorator
 */

import kind from '@enact/core/kind';
import EnactPropTypes from '@enact/core/internal/prop-types';
import {handle, forKey, forward} from '@enact/core/handle';
import Spotlight from '@enact/spotlight';
import Changeable from '@enact/ui/Changeable';
import Toggleable from '@enact/ui/Toggleable';
import Group from '@enact/ui/Group';
import Pure from '@enact/ui/internal/Pure';
import PropTypes from 'prop-types';
import {compose, equals} from 'ramda';
import React from 'react';
import ReactDOM from 'react-dom';
import warning from 'warning';

import Button from '../Button';
import ContextualPopupDecorator from '../ContextualPopupDecorator/ContextualPopupDecorator';
import Item from '../Item';
import Scroller from '../Scroller';
import Skinnable from '../Skinnable';

import css from './Dropdown.module.less';

const compareChildren = (a, b) => {
	if (!a || !b || a.length !== b.length) return false;

	let type = null;
	for (let i = 0; i < a.length; i++) {
		type = type || typeof a[i];
		if (type === 'string') {
			if (a[i] !== b[i]) {
				return false;
			}
		} else if (!equals(a[i], b[i])) {
			return false;
		}
	}

	return true;
};
const isSelectedValid = ({children, selected}) => Array.isArray(children) && children[selected] != null;

const DropdownButton = kind({
	name: 'DropdownButton',

	styles: {
		css,
		className: 'button'
	},

	render: (props) => (
		<Button
			{...props}
			iconPosition="after"
		/>
	)
});

const ContextualButton = ContextualPopupDecorator({noArrow: true}, DropdownButton);

const DropdownListBase = Skinnable(
	kind({
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
			 * The width of DropdownList.
			 *
			 * @type {('large'|'medium'|'small')}
			 */
			width: PropTypes.oneOf(['large', 'medium', 'small'])
		},

		styles: {
			css,
			className: 'dropDownList'
		},

		computed: {
			className: ({width, styler}) => styler.append(width)
		},

		render: ({children, onSelect, scrollTo, selected, ...rest}) => {
			delete rest.width;

			return (
				<Group
					{...rest}
					cbScrollTo={scrollTo}
					childComponent={Item}
					component={children ? Scroller : null}
					onSelect={onSelect}
					select="radio"
					selected={selected}
				>
					{children}
				</Group>
			);
		}
	})
);

class DropdownList extends React.Component {
	static displayName = 'DropdownList'

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
	}

	componentDidUpdate () {
		if (isSelectedValid(this.props)) {
			const {nodeToFocus, nodeToScroll} = this.getNodeToFocus(this.props.selected);

			this.scrollTo({animate: false, node: nodeToScroll});
			Spotlight.focus(nodeToFocus);
		}
	}

	getNodeToFocus = (selected) => {
		const offset = 2;
		const scrollIndex = selected > offset ? selected - offset : 0;

		return {
			nodeToFocus: this.node.querySelector(`[data-index='${selected}']`),
			nodeToScroll: this.node.querySelector(`[data-index='${scrollIndex}']`)
		};
	}

	getScrollTo = (scrollTo) => {
		this.scrollTo = scrollTo;
	}

	render () {
		return (
			<DropdownListBase {...this.props} scrollTo={this.getScrollTo} />
		);
	}
}

/**
 * A stateless Dropdown component.
 *
 * @class DropdownBase
 * @memberof moonstone/Dropdown
 * @extends moonstone/Button.Button
 * @extends moonstone/ContextualPopupDecorator.ContextualPopupDecorator
 * @ui
 * @public
 */
const DropdownBase = kind({
	name: 'Dropdown',

	propTypes: /** @lends moonstone/Dropdown.DropdownBase.prototype */ {
		/**
		 * The selection items to be displayed in the `Dropdown` when `open`.
		 *
		 * Takes either an array of strings or an array of objects. When strings, the values will be
		 * used in the generated components as the readable text. When objects, the properties will
		 * be passed onto an `Item` component and `children` as well as a unique `key` property are
		 * required.
		 *
		 * @type {String[]|Array.<{key: (Number|String), children: (String|Component)}>}
		 * @public
		 */
		children: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.string),
			PropTypes.arrayOf(PropTypes.shape({
				children: EnactPropTypes.renderable.isRequired,
				key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
			}))
		]),

		/**
		 * Disables Dropdown and becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Called when the Dropdown is closing.
		 *
		 * @type {Function}
		 * @public
		 */
		onClose: PropTypes.func,

		/**
		 * Called when the Dropdown is opening.
		 *
		 * @type {Function}
		 * @public
		 */
		onOpen: PropTypes.func,

		/**
		 * Called when an item is selected.
		 *
		 * @type {Function}
		 * @public
		 */
		onSelect: PropTypes.func,

		/**
		 * Displays the items.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		open: PropTypes.bool,

		/**
		 * Index of the selected item.
		 *
		 * @type {Number}
		 * @public
		 */
		selected: PropTypes.number,

		/**
		 * The primary title text of Dropdown.
		 * The title will be replaced if an item is selected.
		 *
		 * @type {String}
		 * @required
		 * @public
		 */
		title: PropTypes.string,

		/**
		 * The width of Dropdown.
		 *
		 * @type {('large'|'medium'|'small')}
		 * @default 'medium'
		 * @public
		 */
		width: PropTypes.oneOf(['large', 'medium', 'small'])
	},

	defaultProps: {
		direction: 'down',
		open: false,
		width: 'medium'
	},

	handlers: {
		onKeyDown: handle(
			forward('onKeyDown'),
			(ev, props) => forKey('left', ev, props) || forKey('right', ev, props),
			forward('onClose')
		),
		onSelect: handle(
			forward('onSelect'),
			forward('onClose')
		)
	},

	styles: {
		css,
		className: 'dropdown'
	},

	computed: {
		children: ({children, selected}) => {
			if (!Array.isArray(children)) return [];

			return children.map((child, i) => {
				const aria = {
					role: 'checkbox',
					'aria-checked': selected === i
				};

				warning(
					child != null,
					`Unsupported null or undefined child provided at index ${i} which will not be visible when rendered.`
				);

				if (typeof child === 'string') {
					return {
						...aria,
						children: child,
						key: `item${i}`
					};
				}

				return {
					...aria,
					...child
				};
			});
		},
		className: ({width, styler}) => styler.append(width),
		title: ({children, selected, title}) => {
			if (isSelectedValid({children, selected})) {
				const child = children[selected];
				return typeof child === 'object' ? child.children : child;
			}

			return title;
		}
	},

	render: ({children, disabled, onKeyDown, onOpen, onSelect, open, selected, width, title, ...rest}) => {
		const popupProps = {children, onKeyDown, onSelect, selected, width, role: ''};

		// `ui/Group`/`ui/Repeater` will throw an error if empty so we disable the Dropdown and
		// prevent Dropdown to open if there are no children.
		const hasChildren = children.length > 0;
		const openDropdown = hasChildren && !disabled && open;
		delete rest.width;

		return (
			<ContextualButton
				{...rest}
				disabled={hasChildren ? disabled : true}
				icon={openDropdown ? 'arrowlargeup' : 'arrowlargedown'}
				popupProps={popupProps}
				popupComponent={DropdownList}
				onClick={onOpen}
				open={openDropdown}
			>
				{title}
			</ContextualButton>
		);
	}
});

/**
 * Applies Moonstone specific behaviors and functionality to
 * [DropdownBase]{@link moonstone/Dropdown.DropdownBase}.
 *
 * @hoc
 * @memberof moonstone/Dropdown
 * @mixes ui/Changeable.Changeable
 * @mixes ui/Toggleable.Toggleable
 * @public
 */
const DropdownDecorator = compose(
	Pure({propComparators: {
		children: compareChildren
	}}),
	Changeable({
		change: 'onSelect',
		prop: 'selected'
	}),
	Toggleable({
		activate: 'onOpen',
		deactivate: 'onClose',
		prop: 'open',
		toggle: null
	})
);

/**
 * A Moonstone Dropdown component.
 *
 * By default, `Dropdown` maintains the state of its `selected` property. Supply the
 * `defaultSelected` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `selected` at creation time and update it in response to
 * `onSelected` events.
 *
 * @class Dropdown
 * @memberof moonstone/Dropdown
 * @extends moonstone/Dropdown.DropdownBase
 * @ui
 * @public
 */
const Dropdown = DropdownDecorator(DropdownBase);

export default Dropdown;
export {
	Dropdown,
	DropdownBase,
	DropdownDecorator
};
