/**
 * A [LabeledItem]{@link moonstone/LabeledItem} (title with a label), which when activated, expands
 * to reveal its children. Often used to display a current setting and its options in a compact way.
 * When expanded, the following sibblings are pushed down, with an animation - enabled by default.
 *
 * @module moonstone/ExpandableItem
 * @exports ExpandableItem
 * @exports ExpandableItemBase
 * @exports ExpandableItemDecorator
 * @exports Expandable
 */

import {extractAriaProps} from '@enact/core/util';
import {forward, handle} from '@enact/core/handle';
import {is} from '@enact/core/keymap';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';
import Spotlight from '@enact/spotlight';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';

import LabeledItem from '../LabeledItem';

import Expandable from './Expandable';
import {ExpandableItemBase as UiExpandableItemBase, ExpandableTransitionContainer as UiExpandableTransitionContainer} from '@enact/ui/ExpandableItem';

const isUp = is('up');
const isDown = is('down');

const ExpandableTransitionContainer = SpotlightContainerDecorator(UiExpandableTransitionContainer);

/**
 * Renders a {@link moonstone/LabeledItem.LabeledItem} that can be expanded to show additional
 * contents.
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
		 * The secondary, or supportive text. Typically under the `title`, a subtitle. When this is
		 * blank or null, the `noneText` will be displayed.
		 *
		 * @see moonstone/ExpandableItem.ExpandableItemBase#noneText
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
		 * @see moonstone/ExpandableItem.ExpandableItemBase#label
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
		 * @see moonstone/ExpandableItem.ExpandableItemBase#label
		 * @see moonstone/ExpandableItem.ExpandableItemBase#noneText
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
				// Spotlight.pause();

				if (open) {
					onClose(ev);
				} else {
					onOpen(ev);
				}
			}
		},
		onHide: handle(
			forward('onHide'),
			Spotlight.resume
		),
		onShow: handle(
			forward('onShow'),
			Spotlight.resume
		)
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
		open: ({disabled, open}) => (open && !disabled),
		titleIcon: ({disabled, open}) => (open && !disabled ? 'arrowlargeup' : 'arrowlargedown'),
		transitionSpotlightDisabled: ({open, spotlightDisabled}) => (spotlightDisabled || !open)
	},

	render: ({
		children,
		disabled,
		handleKeyDown,
		handleLabelKeyDown,
		handleOpen,
		label,
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
		titleIcon,
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
			<UiExpandableItemBase
				{...rest}
				aria-disabled={disabled}
				disabled={disabled}
				open={open}
				childRef={setContainerNode}

				// component={SpottableContainerDiv}
				titleComponent={
					<LabeledItem
						{...ariaProps}
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
						titleIcon={titleIcon}
					/>
				}
				container={
					<ExpandableTransitionContainer
						data-expandable-container
						onKeyDown={handleKeyDown}
						spotlightDisabled={transitionSpotlightDisabled}
					/>
				}
				direction="down"
				duration="short"
				onHide={onHide}
				onShow={onShow}
				// onTap={handleOpen}
				text={title} //
				timingFunction="ease-out-quart"
				type="clip"
				// visible={open}
			>
				{children}
			</UiExpandableItemBase>
		);

		// return (
		// 	<ContainerDiv
		// 		{...rest}
		// 		aria-disabled={disabled}
		// 		disabled={disabled}
		// 		open={open}
		// 		ref={setContainerNode}
		// 	>
		// 		<LabeledItem
		// 			{...ariaProps}
		// 			data-expandable-label
		// 			disabled={disabled}
		// 			label={label}
		// 			onTap={handleOpen}
		// 			onKeyDown={handleLabelKeyDown}
		// 			onSpotlightDisappear={onSpotlightDisappear}
		// 			onSpotlightLeft={onSpotlightLeft}
		// 			onSpotlightRight={onSpotlightRight}
		// 			onSpotlightUp={onSpotlightUp}
		// 			spotlightDisabled={spotlightDisabled}
		// 			titleIcon={titleIcon}
		// 		>{title}</LabeledItem>
		// 		<ExpandableTransitionContainer
		// 			// childRef={childRef}
		// 			// clipHeight={clipHeight}
		// 			// noAnimation={noAnimation}

		// 		//	data-expandable-container
		// 			// duration={duration}
		// 			duration="short"
		// 			// timingFunction={timingFunction}
		// 			timingFunction="ease-out-quart"
		// 			// onHide={onHide}
		// 			onHide={onHide}
		// 			onKeyDown={handleKeyDown} //
		// 			// onShow={onShow}
		// 			onShow={onShow}
		// 			spotlightDisabled={transitionSpotlightDisabled} //
		// 			// type={type}
		// 			type="clip"
		// 			// direction={direction}
		// 			direction="down"
		// 			// visible={open}
		// 			visible={open}
		// 		>
		// 			{children}
		// 		</ExpandableTransitionContainer>
		// 	</ContainerDiv>
		// );
	}
});

/**
 * Adds spotlight and expandability functionality to
 * [ExpandableItemBase]{@link moonstone/ExpandableItem.ExpandableItemBase}.
 *
 * @class ExpandableItemDecorator
 * @memberof moonstone/ExpandableItem
 * @mixes moonstone/ExpandableItem.Expandable
 * @mixes spotlight/SpotlightContainerDecorator
 * @hoc
 * @public
 */
// const ExpandableItemDecorator = compose(
// 	Expandable,
// 	SpotlightContainerDecorator({continue5WayHold: true}),	// Migration Note: Investigate the purpose of this
// );
const ExpandableItemDecorator = Expandable;

/**
 * This maintains its open/closed state by default. The initial state can be supplied
 * using `defaultOpen`. In order to directly control the open/closed state, supply a value for
 * `open` at creation time and update the prop value in the callbacks for the `onClose`/`onOpen`
 * events.
 *
 * @class ExpandableItem
 * @memberof moonstone/ExpandableItem
 * @extends moonstone/ExpandableItem.ExpandableItemBase
 * @mixes moonstone/ExpandableItem.ExpandableItemDecorator
 * @ui
 * @public
 */
const ExpandableItem = ExpandableItemDecorator(ExpandableItemBase);

export default ExpandableItem;
export {
	Expandable,
	ExpandableItem,
	ExpandableItemBase,
	ExpandableItemDecorator
};
