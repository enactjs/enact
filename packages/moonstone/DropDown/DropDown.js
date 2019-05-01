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

import {Expandable} from '../ExpandableItem';
import {ExpandableTransitionContainer} from '../ExpandableItem/ExpandableTransitionContainer';
import {MarqueeDecorator} from '../Marquee';
import {Button} from '../Button';
import ContextualPopupDecorator from '../ContextualPopupDecorator';
import {Item} from '../Item';
import {Scroller} from '../Scroller';
import Skinnable from '../Skinnable/Skinnable';

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


const PureGroup = Pure(
	{propComparators: {
		children: compareChildren,
		itemProps: (a, b) => (
			a.onSpotlightDisappear === b.onSpotlightDisappear &&
			a.onSpotlightLeft === b.onSpotlightLeft &&
			a.onSpotlightRight === b.onSpotlightRight &&
			a.spotlightDisabled === b.spotlightDisabled
		)
	}},
	Group
);

const DropDownButton = (props) => (
	<Button
		{...props}
		icon="arrowlargedown"
		className={css.button}
	/>
);

const ContextualButton = ContextualPopupDecorator(DropDownButton);

const DropDownList = kind({
	name: 'DropDownList',

	render: ({children, hideChildren, onHide, onSelect, onShow, open, selected, ...props}) => {
		if (children.length > 5) {
			return (
				<Scroller style={{height: '200px'}}>
					<PureGroup
						{...props}
						childComponent={Item}
						onSelect={onSelect}
						selected={selected}
						selectedProp="selected"
					>
						{children}
					</PureGroup>
				</Scroller>
			);
		}
		return (
			<Group
				{...props}
				childComponent={Item}
				onSelect={onSelect}
				selected={selected}
				selectedProp="selected"
			>
				{children}
			</Group>
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

	render: ({children, className, hideChildren, onSelect, open, selected, setContainerNode, title, ...rest}) => {
		delete rest.inline;

		const popupProps = {children, hideChildren, onSelect, open, selected};

		return (
			<div className={className} ref={setContainerNode}>
				<ContextualButton
					small
					popupProps={popupProps}
					popupComponent={DropDownList}
					popupClassName={css.dropDownList}
					onClick={rest.onOpen}
					open={open}
					{...rest}
				>
					{title}
				</ContextualButton>
			</div>
		);
	}
});

const DropDown = Pure(
	{propComparators: {
		children: compareChildren
	}},
	Changeable(
		{change: 'onSelect', prop: 'selected'},
		Expandable(
			{
				getChildFocusTarget: (node, {selected = 0}) => {
					let selectedIndex = selected;
					if (Array.isArray(selected) && selected.length) {
						selectedIndex = selected[0];
					}

					let selectedNode = null;
					if (node) {
						selectedNode = node.querySelector(`[data-index="${selectedIndex}"]`);
					}

					return selectedNode;
				}
			},
			DropDownBase
		)
	)
);

export default DropDown;
export {
	DropDown,
	DropDownBase
};
