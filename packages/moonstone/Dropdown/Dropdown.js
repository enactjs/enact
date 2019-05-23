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


import Changeable from '@enact/ui/Changeable';
import Toggleable from '@enact/ui/Toggleable';
import equals from 'ramda/src/equals';
import Group from '@enact/ui/Group';
import kind from '@enact/core/kind';
import Pure from '@enact/ui/internal/Pure';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import React from 'react';

import {Button} from '../Button/Button';
import ContextualPopupDecorator from '../ContextualPopupDecorator/ContextualPopupDecorator';
import {Item} from '../Item/Item';
import {Scroller} from '../Scroller/Scroller';
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

const DropdownList = Skinnable(
	kind({
		name: 'DropdownList',

		propTypes: /** @lends moonstone/Dropdown.DropdownBase.prototype */ {
			/**
			 * The selections for Dropdown
			 *
			 * @type {String[]|Object[]}
			 * @private
			 */
			children: PropTypes.oneOfType([
				PropTypes.arrayOf(PropTypes.string),
				PropTypes.arrayOf(PropTypes.shape({
					key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
				}))
			]),

			/**
			 * Called when an item is selected.
			 *
			 * @type {Function}
			 * @private
			 */
			onSelect: PropTypes.func,

			/**
			 * Index of the selected item.
			 *
			 * @type {Number}
			 * @private
			 */
			selected: PropTypes.number
		},

		styles: {
			className: 'dropDownList',
			css
		},

		render: ({children, onSelect, selected, ...rest}) => {
			return (
				<div {...rest}>
					<Group
						childComponent={Item}
						className={css.group}
						component={children ? Scroller : null}
						onSelect={onSelect}
						selected={selected}
					>
						{children}
					</Group>
				</div>
			);
		}
	})
);

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
		 * The selection items to be displayed in the `DropdownList`.
		 * Takes an array of strings and the strings will be used in
		 * the generated components as the readable text.
		 *
		 * @type {String[]|Object[]}
		 * @public
		 */
		children: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.string),
			PropTypes.arrayOf(PropTypes.shape({
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
		 * Displays the `DropdownList`.
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
		title: PropTypes.string
	},

	defaultProps: {
		direction: 'down',
		open: false
	},

	handlers: {
		onSelect: (ev, {onClose, onSelect}) => {
			if (onClose) {
				onClose(ev);
			}

			if (onSelect) {
				onSelect(ev);
			}
		}
	},

	styles: {
		css,
		className: 'dropdown'
	},

	computed: {
		title: ({children, selected, title}) => {
			const isSelectedValid = !(typeof selected === 'undefined' || selected === null || selected >= children.length || selected < 0);

			if (children && children.length && isSelectedValid) {
				const isArray = Array.isArray(selected);
				return children[isArray ? selected[0] : selected];
			}

			return title;
		}
	},

	render: ({children, disabled, onOpen, onSelect, open, selected, title, ...rest}) => {
		const popupProps = {children, onSelect, open, selected};

		// `ui/Group`/`ui/Repeater` will throw an error if empty so we disable the Dropdown and prevent Dropdown to open if there are no children.
		const hasChildren = children && children.length;
		const openDropdown = hasChildren ? open : false;

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
 * Applies Moonstone specific behaviors and functionality to [DropdownBase]{@link moonstone/Dropdown.DropdownBase}.
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
 * By default, `Dropdown` maintains the state of its `selected` property.
 * Supply the `defaultSelected` property to control its initial value. If you
 * wish to directly control updates to the component, supply a value to `selected` at creation time
 * and update it in response to `onSelected` events.
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
