/**
 * Provides unstyled expandable item components and behaviors to be customized by
 * a theme or application.
 *
 * @module ui/ExpandableItem
 * @exports ExpandableItem
 * @exports ExpandableItemBase
 * @exports Expandable
 * @exports ExpandableTransitionContainer
 */

import kind from '@enact/core/kind';
import hoc from '@enact/core/hoc';
import React from 'react';
import PropTypes from 'prop-types';
import compose from 'ramda/src/compose';

import ComponentOverride from '../ComponentOverride';
import Touchable from '../Touchable';

import Expandable from './Expandable';
import ExpandableTransitionContainer from './ExpandableTransitionContainer';

/**
 * {@link ui/ExpandableItem.ExpandableItemBase} is a stateless component that renders a component
 * that can be expanded to show additional contents.
 *
 * @class ExpandableItemBase
 * @memberof ui/ExpandableItem
 * @ui
 * @public
 */
const ExpandableItemBase = kind({
	name: 'ui:ExpandableItem',

	propTypes: /** @lends ui/ExpandableItem.ExpandableItemBase.prototype */ {
		/**
		 * The expandable transition container to render the children into. It is highly recommended
		 * to use the [ExpandableTransitionContainer]{@link ui/ExpandableItem.ExpandableTransitionContainer}
		 * as there are many unique properties passed along to this component.
		 *
		 * @type {Component}
		 * @required
		 * @public
		 */
		container: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,

		/**
		 * The primary text of the item.
		 *
		 * @type {String}
		 * @required
		 * @public
		 */
		text: PropTypes.string.isRequired,

		/**
		 * Provide a function to get the reference to the child node (the one with the content) at
		 * render time. Useful if you need to measure or interact with the node directly.
		 *
		 * @type {Function}
		 * @default null
		 * @public
		 */
		childRef: PropTypes.func,

		/**
		 * The contents of the expandable item displayed when `open` is `true`
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node,

		/**
		 * Specifies the height of the transition when `type` is set to `'clip'`.
		 *
		 * @type {Number}
		 * @default null
		 * @public
		 */
		clipHeight: PropTypes.number,

		/**
		 * The component used to render the base level of this component.
		 *
		 * @type {Component}
		 * @default 'div'
		 * @public
		 */
		component: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

		/**
		 * Sets the direction of transition. Where the component will move *to*; the destination.
		 * Supported directions are: `'up'`, `'right'`, `'down'`, `'left'`.
		 *
		 * @type {String}
		 * @default 'down'
		 * @public
		 */
		direction: PropTypes.oneOf(['up', 'right', 'down', 'left']),

		/**
		 * Control how long the transition should take.
		 * Supported durations are: `'short'` (250ms), `'long'` (1s). `'medium'` (500ms) is default
		 * when no others are specified.
		 *
		 * @type {String}
		 * @default 'short'
		 * @public
		 */
		duration: PropTypes.oneOf(['short', 'medium', 'long']),

		/**
		 * When `true`, transition animation is disabled. When `false`, visibility changes animate.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAnimation: PropTypes.bool,

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
		 * Customize the transition timing function.
		 * Supported function names are: `ease`, `ease-in`, `ease-out`, `ease-in-out`, `ease-in-quart`,
		 * `ease-out-quart`, and `linear`.
		 *
		 * @type {String}
		 * @default 'ease-out-quart'
		 * @public
		 */
		timingFunction: PropTypes.oneOf([
			'ease',
			'ease-in',
			'ease-out',
			'ease-in-out',
			'ease-in-quart',
			'ease-out-quart',
			'linear'
		]),

		/**
		 * The type of component to use to render the primary list item.
		 *
		 * @type {Component}
		 * @default 'div'
		 * @public
		 */
		titleComponent: PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.func]),

		/**
		 * Choose how you'd like the transition to affect the content.
		 * Supported types are: slide, clip, and fade.
		 *
		 * @type {String}
		 * @default 'clip'
		 * @public
		 */
		type: PropTypes.oneOf(['slide', 'clip', 'fade'])
	},

	defaultProps: {
		component: 'div',
		titleComponent: 'div',
		direction: 'down',
		open: false,
		timingFunction: 'ease-out-quart',
		type: 'clip'
	},

	render: ({
		component: Component,
		titleComponent,
		container,
		childRef,
		children,
		clipHeight,
		direction,
		duration,
		noAnimation,
		onHide,
		onShow,
		open,
		text,
		timingFunction,
		type,
		...rest
	}) => {
		delete rest.onClose;
		delete rest.onOpen;

		return (
			<Component {...rest}>
				<ComponentOverride
					component={titleComponent}
					// Add activation and deactivation callbacks to this component
					// This needs a wording change. it's more of an expandable "handle". It accepts
					// a component and attaches actions that should be activated by toggleable.
				>
					{text}
				</ComponentOverride>
				<ComponentOverride
					component={container}
					childRef={childRef}
					clipHeight={clipHeight}
					direction={direction}
					duration={duration}
					noAnimation={noAnimation}
					onHide={onHide}
					onShow={onShow}
					timingFunction={timingFunction}
					type={type}
					visible={open}
				>
					{children}
				</ComponentOverride>
			</Component>
		);
	}
});

/**
 * Adds open/close support to the wrapped element
 *
 * @class ExpandableHandlerDecorator
 * @memberof ui/ExpandableItem
 * @hoc
 * @public
 */
const ExpandableHandlerDecorator = hoc((config, Wrapped) => kind({
	name: 'ui:ExpandableHandlerDecorator',
	propTypes: /** @lends ui/ExpandableItem.ExpandableHandlerDecorator.prototype */ {
		onClose: PropTypes.func,
		onOpen: PropTypes.func,
		open: PropTypes.bool
	},
	handlers: {
		handleOpen: (ev, {onClose, onOpen, open}) => {
			if (open && onClose) {
				onClose(ev);
			} else if (!open && onOpen) {
				onOpen(ev);
			}
		}
	},
	render: ({handleOpen, ...rest}) => <Wrapped onTap={handleOpen} {...rest} />
}));

/**
 * The functionality decorator for [ExpandableItemBase]{@link ui/ExpandableItem.ExpandableItemBase}
 *
 * @class ExpandableItemDecorator
 * @memberof ui/ExpandableItem
 * @mixes ui/ExpandableItem.Expandable
 * @mixes ui/ExpandableItem.ExpandableHandlerDecorator
 * @hoc
 * @public
 */
const ExpandableItemDecorator = compose(
	Expandable,
	ExpandableHandlerDecorator,
	Touchable
);

/**
 * Renders a component that can be expanded to show additional contents.
 *
 * `ExpandableItem` maintains its open/closed state by default. The initial state can be supplied
 * using `defaultOpen`. In order to directly control the open/closed state, supply a value for
 * `open` at creation time and update its value in response to `onClose`/`onOpen` events.
 *
 * @class ExpandableItem
 * @memberof ui/ExpandableItem
 * @mixes ui/ExpandableItem.Expandable
 * @ui
 * @public
 */
const ExpandableItem = ExpandableItemDecorator(ExpandableItemBase);

export default ExpandableItem;
export {
	ExpandableItem,
	ExpandableItemBase,
	ExpandableItemDecorator,
	Expandable,
	ExpandableHandlerDecorator,
	ExpandableTransitionContainer
};
