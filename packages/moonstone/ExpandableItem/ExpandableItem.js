/**
 * Exports the {@link moonstone/ExpandableItem.ExpandableItem} and
 * {@link moonstone/ExpandableItem.ExpandableItemBase} components and
 * {@link moonstone/ExpandableItem/Expandable.Expandable} Higher-Order Component (HOC). The default
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
		disabled: false,
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
		open: ({disabled, open}) => open && !disabled
	},

	render: ({children, disabled, handleOpen, label, open, title, ...rest}) => {
		delete rest.label;
		delete rest.noneText;
		delete rest.onClose;
		delete rest.onOpen;
		delete rest.showLabel;
		delete rest.onOpen;
		delete rest.onClose;

		return (
			<ExpandableContainer {...rest} disabled={disabled} open={open}>
				<LabeledItem
					disabled={disabled}
					label={label}
					onClick={handleOpen}
				>{title}</LabeledItem>
				<ExpandableTransitionContainer data-container-disabled={!open} data-expandable-container visible={open} duration="short" type="clip">
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
