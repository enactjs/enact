import {extractAriaProps} from '@enact/core/util';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import {Expandable, ExpandableTransitionContainer} from '../Expandable';

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
		 * The contents of the expandable item displayed when `open` is `true`
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * The type of component to use to render the item. May be a DOM node name (e.g 'div',
		 * 'span', etc.) or a custom component.
		 *
		 * @type {Component}
		 * @default 'div'
		 * @public
		 */
		component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

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
		setContainerNode: PropTypes.func
	},

	defaultProps: {
		component: 'div',
		open: false
	},

	handlers: {
		handleOpen: (ev, {onClose, onOpen, open}) => {
			if (open) {
				onClose(ev);
			} else {
				onOpen(ev);
			}
		}
	},

	render: ({
		component: Component,
		children,
		handleOpen,
		open,
		onHide,
		onShow,
		setContainerNode,
		title,
		...rest
	}) => {
		delete rest.onClose;
		delete rest.onOpen;

		const ariaProps = extractAriaProps(rest);

		return (
			<div
				{...rest}
				open={open}
				ref={setContainerNode}
			>
				<Component
					{...ariaProps}
					onClick={handleOpen}
				>
					{title}
				</Component>
				<ExpandableTransitionContainer
					duration="short"
					timingFunction="ease-out-quart"
					onHide={onHide}
					onShow={onShow}
					type="clip"
					direction="down"
					visible={open}
				>
					{children}
				</ExpandableTransitionContainer>
			</div>
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
