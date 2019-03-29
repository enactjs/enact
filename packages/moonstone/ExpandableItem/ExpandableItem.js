/**
 * Moonstone styled expandable item.
 *
 * @example
 * <ExpandableItem
 *   title="Expandable Item"
 * >
 *   This is an Expandable Item
 * </ExpandableItem>
 *
 * @module moonstone/ExpandableItem
 * @exports Expandable
 * @exports ExpandableItem
 * @exports ExpandableItemBase
 */

import {is} from '@enact/core/keymap';
import kind from '@enact/core/kind';
import {extractAriaProps} from '@enact/core/util';
import {getContainersForNode} from '@enact/spotlight/src/container';
import {getTargetByDirectionFromElement} from '@enact/spotlight/src/target';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import PropTypes from 'prop-types';
import last from 'ramda/src/last';
import React from 'react';

import LabeledItem from '../LabeledItem';

import Expandable from './Expandable';
import ExpandableTransitionContainer from './ExpandableTransitionContainer';

import css from './ExpandableItem.module.less';

const isUp = is('up');
const isDown = is('down');

const ContainerDiv = SpotlightContainerDecorator({continue5WayHold: true}, 'div');

// Returns `true` if a directional movement would leave the same container as `srcNode` is in.
// For a more generalized implementation, there'd need to be some way to specify an upper-most
// container for dealing with cases of components that are themselves wrapped in containers.
function wouldDirectionLeaveContainer (dir, srcNode) {
	const target = getTargetByDirectionFromElement(dir, srcNode);

	// If there's no target in the direction we won't move
	if (!target) {
		return false;
	}

	const targetContainer = last(getContainersForNode(target));
	const srcContainer = last(getContainersForNode(srcNode));

	return (targetContainer !== srcContainer);
}

/**
 * A stateless component that renders a {@link moonstone/LabeledItem.LabeledItem} that can be
 * expanded to show additional contents.
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
		 * Closes the expandable automatically when the user navigates to the `title`
		 * of the component using 5-way controls; if `false`, the user must select/tap the title to
		 * close the expandable.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		autoClose: PropTypes.bool,

		/**
		 * The contents of the expandable item displayed when `open` is `true`.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Disables voice control.
		 *
		 * @type {Boolean}
		 * @memberof moonstone/ExpandableItem.ExpandableItemBase.prototype
		 * @public
		 */
		'data-webos-voice-disabled': PropTypes.bool,

		/**
		 * The voice control group.
		 *
		 * @type {String}
		 * @memberof moonstone/ExpandableItem.ExpandableItemBase.prototype
		 * @public
		 */
		'data-webos-voice-group-label': PropTypes.string,

		/**
		 * The voice control intent.
		 *
		 * @type {String}
		 * @memberof moonstone/ExpandableItem.ExpandableItemBase.prototype
		 * @public
		 */
		'data-webos-voice-intent': PropTypes.string,

		/**
		 * The voice control label.
		 *
		 * @type {String}
		 * @memberof moonstone/ExpandableItem.ExpandableItemBase.prototype
		 * @public
		 */
		'data-webos-voice-label': PropTypes.string,

		/**
		 * Disables ExpandableItem and the control becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Prevents rendering the transition container.
		 *
		 * @type {Boolean}
		 * @default false
		 * @private
		 */
		hideChildren: PropTypes.bool,

		/**
		 * The secondary, or supportive text. Typically under the `title`, a subtitle.
		 *
		 * @type {Node}
		 * @public
		 */
		label: PropTypes.node,

		/**
		 * Prevents the user from moving [Spotlight] {@link /docs/developer-guide/glossary/#spotlight} past the bottom
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
		 * Called when a condition occurs which should cause the expandable to close.
		 *
		 * @type {Function}
		 * @public
		 */
		onClose: PropTypes.func,

		/**
		 * Called when the expandable closes.
		 *
		 * @type {Function}
		 * @private
		 */
		onHide: PropTypes.func,

		/**
		 * Called when a condition occurs which should cause the expandable to open.
		 *
		 * @type {Function}
		 * @public
		 */
		onOpen: PropTypes.func,

		/**
		 * Called when the expandable opens.
		 *
		 * @type {Function}
		 * @private
		 */
		onShow: PropTypes.func,

		/**
		 * Called when the component is removed while retaining focus.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightDisappear: PropTypes.func,

		/**
		 * Called prior to focus leaving the expandable when the 5-way down key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightDown: PropTypes.func,

		/**
		 * Called prior to focus leaving the expandable when the 5-way left key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightLeft: PropTypes.func,

		/**
		 * Called prior to focus leaving the expandable when the 5-way right key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightRight: PropTypes.func,

		/**
		 * Called prior to focus leaving the expandable when the 5-way up key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightUp: PropTypes.func,

		/**
		 * Opens ExpandableItem with the contents visible.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		open: PropTypes.bool,

		/**
		 * Sets a reference to the root container node of the ExpandableItem.
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
		 * Disables spotlight navigation into the component.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		spotlightDisabled: PropTypes.bool
	},

	defaultProps: {
		'data-webos-voice-intent': 'Select',
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
				if (autoClose && onClose && isUp(keyCode) && wouldDirectionLeaveContainer('up', target)) {
					onClose();
					ev.nativeEvent.stopImmediatePropagation();
					ev.preventDefault();
				} else if (isDown(keyCode) && wouldDirectionLeaveContainer('down', target)) {
					if (lockBottom) {
						ev.nativeEvent.stopImmediatePropagation();
						ev.preventDefault();
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
		'data-webos-voice-disabled': voiceDisabled,
		'data-webos-voice-group-label': voiceGroupLabel,
		'data-webos-voice-intent': voiceIntent,
		'data-webos-voice-label': voiceLabel,
		disabled,
		handleKeyDown,
		handleLabelKeyDown,
		handleOpen,
		hideChildren,
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
				spotlightDisabled={spotlightDisabled || disabled}
			>
				<LabeledItem
					{...ariaProps}
					css={css}
					className={labeledItemClassName}
					data-expandable-label
					data-webos-voice-disabled={voiceDisabled}
					data-webos-voice-group-label={voiceGroupLabel}
					data-webos-voice-intent={voiceIntent}
					data-webos-voice-label={voiceLabel}
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
				{!hideChildren ?
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
					</ExpandableTransitionContainer> :
					null
				}
			</ContainerDiv>
		);
	}
});

/**
 * A component that renders a {@link moonstone/LabeledItem.LabeledItem} that can be expanded to
 * show additional contents.
 *
 * `ExpandableItem` maintains its open/closed state by default. The initial state can be supplied
 * using `defaultOpen`. In order to directly control the open/closed state, supply a value for
 * `open` at creation time and update its value in response to `onClose`/`onOpen` events.
 *
 * @class ExpandableItem
 * @memberof moonstone/ExpandableItem
 * @extends moonstone/ExpandableItem.ExpandableItemBase
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
