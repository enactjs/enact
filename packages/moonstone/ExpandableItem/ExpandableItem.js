/**
 * Exports the {@link moonstone/ExpandableItem.ExpandableItem} and
 * {@link moonstone/ExpandableItem.ExpandableItemBase} components and
 * {@link moonstone/ExpandableItem.Expandable} Higher-Order Component (HOC). The default
 * export is {@link moonstone/ExpandableItem.ExpandableItem}.
 *
 * @module moonstone/ExpandableItem
 */

import {extractAriaProps} from '@enact/core/util';
import {is} from '@enact/core/keymap';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';

import LabeledItem from '../LabeledItem';

import Expandable from './Expandable';
import ExpandableTransitionContainer from './ExpandableTransitionContainer';

import css from './ExpandableItem.less';

const isUp = is('up');
const isDown = is('down');

const ContainerDiv = SpotlightContainerDecorator({continue5WayHold: true}, 'div');

/**
 * {@link moonstone/ExpandableItem.ExpandableItemBase} is a stateless component that
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
		 * @type {Node}
		 * @public
		 */
		label: PropTypes.node,

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
		 * @public
		 */
		onClose: PropTypes.func,

		/**
		 * Callback to be called when the expandable closes
		 *
		 * @type {Function}
		 * @private
		 */
		onHide: PropTypes.func,

		/**
		 * Callback to be called when a condition occurs which should cause the expandable to open
		 *
		 * @type {Function}
		 * @public
		 */
		onOpen: PropTypes.func,

		/**
		 * Callback to be called when the expandable opens
		 *
		 * @type {Function}
		 * @private
		 */
		onShow: PropTypes.func,

		/**
		 * The handler to run when the component is removed while retaining focus.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightDisappear: PropTypes.func,

		/**
		 * The handler to run prior to focus leaving the expandable when the 5-way down key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightDown: PropTypes.func,

		/**
		 * The handler to run prior to focus leaving the expandable when the 5-way left key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightLeft: PropTypes.func,

		/**
		 * The handler to run prior to focus leaving the expandable when the 5-way right key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightRight: PropTypes.func,

		/**
		 * The handler to run prior to focus leaving the expandable when the 5-way up key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightUp: PropTypes.func,

		/**
		 * When `true`, the control is rendered in the expanded state, with the contents visible
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		open: PropTypes.bool,

		/**
		 * Sets a reference to the root container node of the ExpandableItem
		 *
		 * @type {Function}
		 * @private
		 */
		setContainerNode: PropTypes.func,

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
		showLabel: PropTypes.oneOf(['always', 'never', 'auto']),

		/**
		 * When `true`, the component cannot be navigated using spotlight.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		spotlightDisabled: PropTypes.bool
	},

	defaultProps: {
		autoClose: false,
		disabled: false,
		lockBottom: false,
		open: false,
		showLabel: 'auto',
		spotlightDisabled: false
	},

	handlers: {
		handleKeyDown: (ev, {autoClose, lockBottom, onClose, onSpotlightDown}) => {
			if (autoClose || lockBottom || onSpotlightDown) {
				const {keyCode, target} = ev;
				// Basing first/last child on the parent of the target to support both the use
				// case here in which the children of the container are spottable and the
				// ExpandableList use case which has an intermediate child (Group) between the
				// spottable components and the container.
				if (autoClose && isUp(keyCode) && target.parentNode.firstChild === target && onClose) {
					onClose();
					ev.nativeEvent.stopImmediatePropagation();
				} else if (isDown(keyCode) && target.parentNode.lastChild === target) {
					if (lockBottom) {
						ev.nativeEvent.stopImmediatePropagation();
					} else if (onSpotlightDown) {
						onSpotlightDown(ev);
					}
				}
			}
		},
		handleLabelKeyDown: (ev, {onSpotlightDown, open}) => {
			if (isDown(ev.keyCode) && !open && onSpotlightDown) {
				onSpotlightDown(ev);
			}
		},
		handleOpen: (ev, {disabled, onClose, onOpen, open}) => {
			// When disabled, don't attach an event
			if (!disabled) {
				if (open) {
					onClose(ev);
				} else {
					onOpen(ev);
				}
			}
		}
	},

	styles: {
		css,
		className: 'expandableItem'
	},

	computed: {
		className: ({disabled, label, noneText, open, showLabel, styler}) => (styler.append({
			open: open && !disabled,
			autoLabel: showLabel === 'auto' && (label || noneText)
		})),
		label: ({label, noneText}) => (label || noneText),
		labeledItemClassName: ({showLabel, styler}) => (styler.join(css.labeledItem, css[showLabel])),
		open: ({disabled, open}) => (open && !disabled),
		transitionSpotlightDisabled: ({open, spotlightDisabled}) => (spotlightDisabled || !open)
	},

	render: ({
		children,
		disabled,
		handleKeyDown,
		handleLabelKeyDown,
		handleOpen,
		label,
		labeledItemClassName,
		open,
		onHide,
		onShow,
		onSpotlightDisappear,
		onSpotlightLeft,
		onSpotlightRight,
		onSpotlightUp,
		setContainerNode,
		spotlightDisabled,
		title,
		transitionSpotlightDisabled,
		...rest
	}) => {
		delete rest.autoClose;
		delete rest.lockBottom;
		delete rest.noneText;
		delete rest.onClose;
		delete rest.onOpen;
		delete rest.onSpotlightDown;
		delete rest.showLabel;

		const ariaProps = extractAriaProps(rest);

		return (
			<ContainerDiv
				{...rest}
				aria-disabled={disabled}
				disabled={disabled}
				ref={setContainerNode}
			>
				<LabeledItem
					{...ariaProps}
					css={css}
					className={labeledItemClassName}
					data-expandable-label
					disabled={disabled}
					label={label}
					onTap={handleOpen}
					onKeyDown={handleLabelKeyDown}
					onSpotlightDisappear={onSpotlightDisappear}
					onSpotlightLeft={onSpotlightLeft}
					onSpotlightRight={onSpotlightRight}
					onSpotlightUp={onSpotlightUp}
					spotlightDisabled={spotlightDisabled}
					titleIcon="arrowlargedown"
				>{title}</LabeledItem>
				<ExpandableTransitionContainer
					data-expandable-container
					duration="short"
					timingFunction="ease-out-quart"
					onHide={onHide}
					onKeyDown={handleKeyDown}
					onShow={onShow}
					spotlightDisabled={transitionSpotlightDisabled}
					type="clip"
					direction="down"
					visible={open}
				>
					{children}
				</ExpandableTransitionContainer>
			</ContainerDiv>
		);
	}
});

/**
 * {@link moonstone/ExpandableItem.ExpandableItem} renders a
 * {@link moonstone/LabeledItem.LabeledItem} that can be expanded to show additional
 * contents.
 *
 * `ExpandableItem` maintains its open/closed state by default. The initial state can be supplied
 * using `defaultOpen`. In order to directly control the open/closed state, supply a value for
 * `open` at creation time and update its value in response to `onClose`/`onOpen` events.
 *
 * @class ExpandableItem
 * @memberof moonstone/ExpandableItem
 * @ui
 * @mixes moonstone/ExpandableItem.Expandable
 * @public
 */
const ExpandableItem = Expandable(
	ExpandableItemBase
);

export default ExpandableItem;
export {
	Expandable,
	ExpandableItem,
	ExpandableItemBase
};
