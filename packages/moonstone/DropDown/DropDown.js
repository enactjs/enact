/**
 * Moonstone styled DropDown components
 *
 * @example
 * <DropDown
 * 		defaultSelected={2}
 *		inline
 *		title="Dropdown"
 * >
 *   {['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5']}
 * </DropDown>
 *
 * @module moonstone/DropDown
 * @exports DropDown
 * @exports DropDownBase
 * @exports DropDownBaseDecorator
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

import {Button} from '../Button';
import ContextualPopupDecorator from '../ContextualPopupDecorator';
import {Item} from '../Item';
import {Scroller} from '../Scroller';

import css from './DropDown.module.less';


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

const DropDownButton = kind({
	name: 'DropDownButton',

	styles: {
		css,
		className: 'button'
	},

	render: (props) => (
		<Button
			{...props}
			iconPosition="after"
			small
		/>
	)
});

const ContextualButton = ContextualPopupDecorator({noArrow: true}, DropDownButton);

const DropDownList = kind({
	name: 'DropDownList',

	propTypes: /** @lends moonstone/DropDown.DropDownBase.prototype */ {
		/**
		 * The selections for Dropdown
		 *
		 * @type {String[]}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Called when an item is selected.
		 *
		 * @type {Function}
		 * @public
		 */
		onSelect: PropTypes.func,

		/**
		 * Index of the selected item.
		 *
		 * @type {Number}
		 * @public
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
					component={Scroller}
					onSelect={onSelect}
					selected={selected}
					selectedProp="selected"
				>
					{children}
				</Group>
			</div>
		);
	}
});

/**
 * A stateless DropDown component.
 *
 * @class DropDownBase
 * @memberof moonstone/DropDown
 * @extends moonstone/Button.Button
 * @extends moonstone/ContextualPopupDecorator.ContextualPopupDecorator
 * @ui
 * @public
 */
const DropDownBase = kind({
	name: 'DropDown',

	propTypes: /** @lends moonstone/DropDown.DropDownBase.prototype */ {
		/**
		 * The selection items to be displayed in the `DropDownList`.
		 * Takes an array of strings and the strings will be used in
		 * the generated components as the readable text.
		 *
		 * @type {String[]}
		 * @required
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Called when the DropDown is closing.
		 *
		 * @type {Function}
		 * @public
		 */
		onClose: PropTypes.func,

		/**
		 * Called when the DropDown is opening.
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
		 * Displays the `DropDownList`.
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
		 * The primary title text of DropDown.
		 * The title will be replaced if an item is selected.
		 *
		 * @type {String}
		 * @required
		 * @public
		 */
		title: PropTypes.string
	},

	defaultProps: {
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

			if (children.length && isSelectedValid) {
				const isArray = Array.isArray(selected);
				return children[isArray ? selected[0] : selected];
			}

			return title;
		}
	},

	render: ({children, onOpen, onSelect, open, selected, title, ...rest}) => {
		const popupProps = {children, onSelect, open, selected};

		return (
			<ContextualButton
				{...rest}
				icon={open ? 'arrowlargeup' : 'arrowlargedown'}
				popupProps={popupProps}
				popupComponent={DropDownList}
				onClick={onOpen}
				open={open}
			>
				{title}
			</ContextualButton>
		);
	}
});

/**
 * Applies Moonstone specific behaviors and functionality to [DropDownBase]{@link moonstone/DropDown.DropDownBase}.
 *
 * @hoc
 * @memberof moonstone/DropDown
 * @mixes ui/Changeable.Changeable
 * @mixes ui/Toggleable.Toggleable
 * @public
 */
const DropDownDecorator = compose(
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
 * A Moonstone DropDown component.
 *
 * By default, `DropDown` maintains the state of its `selected` property.
 * Supply the `defaultSelected` property to control its initial value. If you
 * wish to directly control updates to the component, supply a value to `selected` at creation time
 * and update it in response to `onSelected` events.
 *
 * @class DropDown
 * @memberof moonstone/DropDown
 * @extends moonstone/DropDown.DropDownBase
 * @ui
 * @public
 */
const DropDown = DropDownDecorator(DropDownBase);

export default DropDown;
export {
	DropDown,
	DropDownBase,
	DropDownDecorator
};
