import kind from '@enact/core/kind';
import React, {PropTypes} from 'react';
import {SpotlightContainerDecorator} from '@enact/spotlight';
import Transition from '@enact/ui/Transition';

import LabeledItem from '../LabeledItem';

import ExpandableContainer from './ExpandableContainer';

const TransitionContainer = SpotlightContainerDecorator(Transition);

const ExpandableItemBase = kind({
	name: 'ExpandableItem',

	propTypes: {
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
		 * @type {String|Number}
		 * @default null
		 * @public
		 */
		label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

		/**
		 * Text to display when no `label` or `value` is set. Leave blank to have the initial
		 * control not display a label when no option is selected.
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
		 * When `true`, the control in rendered in the expanded state, with the contents visible?
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		open: PropTypes.bool,

		/**
		 * Controls when the label is shown.
		 *
		 * * `true` - The label is always visible
		 * * `false` - The label is always hidden
		 * * `'auto'` - The label is visible when the expandable is closed
		 *
		 * @type {Boolean|String}
		 * @default 'auto'
		 * @public
		 */
		showLabel: PropTypes.oneOf([true, false, 'auto'])
	},

	defaultProps: {
		disabled: false,
		open: false,
		showLabel: 'auto'
	},

	computed: {
		label: ({disabled, label, noneText, open, showLabel}) => {
			const isOpen = open && !disabled;
			if (showLabel === true || (!isOpen && showLabel)) {
				return label || noneText;
			} else {
				return null;
			}
		},
		handleOpen: ({disabled, onClose, onOpen, onToggle, open}) => {
			// When disabled, don't attach an event
			if (!disabled) {
				const handler = open ? onClose : onOpen;
				if (onToggle && handler) {
					// if we have both, we need to wrap them in a function so they can both be
					// called.
					return () => {
						onToggle({open: !open});
						handler();
					};
				} else if (onToggle) {
					return () => onToggle({open: !open});
				} else {
					return handler;
				}
			}
		},
		open: ({disabled, open}) => open && !disabled
	},

	render: ({children, disabled, handleOpen, label, open, style, title, ...rest}) => {
		delete rest.noneText;
		delete rest.label;
		delete rest.showLabel;

		return (
			<ExpandableContainer style={style} disabled={disabled} open={open}>
				<LabeledItem
					disabled={disabled}
					label={label}
					onClick={handleOpen}
				>{title}</LabeledItem>
				<TransitionContainer data-container-disabled={!open} visible={open} duration="short" type="clip">
					{children}
				</TransitionContainer>
			</ExpandableContainer>
		);
	}
});

export default ExpandableItemBase;
export {ExpandableItemBase as ExpandableItem, ExpandableItemBase};
