/**
 * Moonstone styled labeled DropDown components and behaviors
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
 * @exports DropDownDecorator
 */


import Changeable from '@enact/ui/Changeable';
import Toggleable from '@enact/ui/Toggleable';
import equals from 'ramda/src/equals';
import Group from '@enact/ui/Group';
import kind from '@enact/core/kind';
import Pure from '@enact/ui/internal/Pure';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import defaultProps from 'recompose/defaultProps';
import setPropTypes from 'recompose/setPropTypes';
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
			icon="arrowlargedown"
		/>
	)
});

const ContextualButton = ContextualPopupDecorator({noArrow: true}, DropDownButton);

const DropDownList = kind({
	name: 'DropDownList',

	styles: {
		className: 'dropDownList',
		css
	},

	render: ({children, hideChildren, onHide, onSelect, onShow, open, selected, ...rest}) => {
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
 * A DropDown component.
 *
 * is within [DropDown]{@link moonstone/DropDown.DropDown}.
 *
 * @class DropDownBase
 * @memberof moonstone/DropDown
 * @ui
 * @public
 */
const DropDownBase = kind({
	name: 'DropDown',

	propTypes: /** @lends moonstone/DropDown.DropDownBase.prototype */ {
		/**
		 * The options for Dropdown
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node
	},

	defaultProps: {
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
		className: ({inline, styler}) => styler.append({inline}),
		title: ({children, selected, title}) => {
			if (title && (typeof selected === 'undefined' || selected === null)) {
				return title;
			} else if (children.length && (selected || selected === 0)) {
				const isArray = Array.isArray(selected);
				return children[isArray ? selected[0] : selected];
			}
		}
	},

	render: ({children, hideChildren, onOpen, onSelect, open, selected, setContainerNode, title, ...rest}) => {
		delete rest.inline;

		const popupProps = {children, hideChildren, onSelect, open, selected};

		return (
			<ContextualButton
				{...rest}
				small
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

const DropDown = Pure(
	{propComparators: {
		children: compareChildren
	}},
	Changeable(
		{change: 'onSelect', prop: 'selected'},
		Toggleable(
			{activate: 'onOpen', deactivate: 'onClose', toggle: null, prop: 'open'},
			DropDownBase
		)
	)
);

export default DropDown;
export {
	DropDown,
	DropDownBase
};
