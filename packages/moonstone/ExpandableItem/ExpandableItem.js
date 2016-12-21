/**
 * Exports the {@link moonstone/ExpandableItem.ExpandableItem} and
 * {@link moonstone/ExpandableItem.ExpandableItemBase} components and
 * {@link moonstone/ExpandableItem.Expandable} Higher-Order Component (HOC). The default
 * export is {@link moonstone/ExpandableItem.ExpandableItem}.
 *
 * @module moonstone/ExpandableItem
 */

import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';

import LabeledItem from '../LabeledItem';

import Expandable from './Expandable';
import ExpandableContainer from './ExpandableContainer';
import ExpandableTransitionContainer from './ExpandableTransitionContainer';

/**
 * {@link moonstone/ExpandableItem.ExpandableItem} is a stateless component that
 * renders a {@link moonstone/LabeledItem.LabeledItem} that can be expanded to show
 * additional contents.
 *
 * @class ExpandableItemBase
 * @memberof moonstone/ExpandableItem
 * @ui
 * @public
 */
const ExpandableItemBase = kind({
	name: 'ExpandableItem',

	propTypes: /** @lends moonstone/ExpandableItem.ExpandableItemBase.prototype */ {
		/**
		 * The primary text of the item.
		 *
		 * @type {String}
		 * @required
		 * @public
		 */
		title: PropTypes.string.isRequired,

		/**
		 * When `true`, the expandable automatically closes when the user navigates to the `title`
		 * of the component using 5-way controls; if `false`, the user must select/tap the header to
		 * close the expandable.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		autoClose: PropTypes.bool,

		/**
		 * The contents of the expandable item displayed when `open` is `true`
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * When `true`, applies a disabled style and the control becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * The secondary, or supportive text. Typically under the `title`, a subtitle.
		 *
		 * @type {String}
		 * @default null
		 * @public
		 */
		label: PropTypes.string,

		/**
		 * When `true`, the user is prevented from moving {@glossary Spotlight} past the bottom
		 * of the expandable (when open) using 5-way controls.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		lockBottom: PropTypes.bool,

		/**
		 * Text to display when no `label` or `value` is set.
		 *
		 * @type {String}
		 */
		noneText: PropTypes.string,

		/**
		 * Callback to be called when a condition occurs which should cause the expandable to close
		 *
		 * @type {Function}
		 * @default null
		 * @public
		 */
		onClose: PropTypes.func,

		/**
		 * Callback to be called when a condition occurs which should cause the expandable to open
		 *
		 * @type {Function}
		 * @default null
		 * @public
		 */
		onOpen: PropTypes.func,

		/**
		 * When `true`, the control is rendered in the expanded state, with the contents visible
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		open: PropTypes.bool,

		/**
		 * Controls when `label` is shown.
		 *
		 * * `'always'` - The label is always visible
		 * * `'never'` - The label is never visible
		 * * `'auto'` - The label is visible when the expandable is closed
		 *
		 * @type {String}
		 * @default 'auto'
		 * @public
		 */
		showLabel: PropTypes.oneOf(['always', 'never', 'auto'])
	},

	defaultProps: {
		autoClose: false,
		disabled: false,
		lockBottom: false,
		open: false,
		showLabel: 'auto'
	},

	computed: {
		label: ({disabled, label, noneText, open, showLabel}) => {
			const isOpen = open && !disabled;
			if (showLabel === 'always' || (!isOpen && showLabel !== 'never')) {
				return label || noneText;
			} else {
				return null;
			}
		},
		handleOpen: ({disabled, onClose, onOpen, open}) => {
			// When disabled, don't attach an event
			if (!disabled) {
				return open ? onClose : onOpen;
			}
		},
		handleKeyDown: ({autoClose, lockBottom, onClose}) => {
			if (autoClose || lockBottom) {
				return (ev) => {
					const {keyCode, target} = ev;
					// Basing first/last child on the parent of the target to support both the use
					// case here in which the children of the container are spottable and the
					// ExpandableList use case which has an intermediate child (Group) between the
					// spottable components and the container.
					if (autoClose && keyCode === 38 && target.parentNode.firstChild === target && onClose) {
						onClose();
						ev.nativeEvent.stopImmediatePropagation();
					} else if (lockBottom && keyCode === 40 && target.parentNode.lastChild === target) {
						ev.nativeEvent.stopImmediatePropagation();
					}
				};
			}
		},
		open: ({disabled, open}) => open && !disabled
	},

	render: ({children, disabled, handleOpen, label, handleKeyDown, open, title, ...rest}) => {
		delete rest.autoClose;
		delete rest.label;
		delete rest.lockBottom;
		delete rest.noneText;
		delete rest.onClose;
		delete rest.onOpen;
		delete rest.showLabel;

		return (
			<ExpandableContainer {...rest} disabled={disabled} open={open}>
				<LabeledItem
					disabled={disabled}
					label={label}
					onClick={handleOpen}
				>{title}</LabeledItem>
				<ExpandableTransitionContainer
					data-container-disabled={!open}
					data-expandable-container
					duration="short"
					onKeyDown={handleKeyDown}
					type="clip"
					visible={open}
				>
					{children}
				</ExpandableTransitionContainer>
			</ExpandableContainer>
		);
	}
});


/**
 * {@link moonstone/ExpandableItem.ExpandableItem} renders a
 * {@link moonstone/LabeledItem.LabeledItem} that can be expanded to show additional
 * contents.
 *
 * @class ExpandableItem
 * @memberof moonstone/ExpandableItem
 * @ui
 * @mixes moonstone/ExpandableItem.Expandable
 * @public
 */
const ExpandableItem = Expandable(ExpandableItemBase);

export default ExpandableItem;
export {
	Expandable,
	ExpandableItem,
	ExpandableItemBase
};
