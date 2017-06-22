import {forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import ViewManager, {shape} from '@enact/ui/ViewManager';
import invariant from 'invariant';
import React from 'react';
import PropTypes from 'prop-types';
import Spotlight from '@enact/spotlight';

import css from './Panels.less';

/**
 * The container for a set of Panels
 *
 * @class Viewport
 * @private
 */
const ViewportBase = kind({
	name: 'Viewport',

	propTypes: /** @lends Viewport.prototype */ {

		/**
		 * A function that generates a globally-unique identifier for a panel index
		 *
		 * @type {Function}
		 * @required
		 */
		generateId: PropTypes.func.isRequired,

		/**
		 * Set of functions that control how the panels are transitioned into and out of the
		 * viewport
		 *
		 * @type {Arranger}
		 */
		arranger: shape,

		/**
		 * Panels to be rendered
		 *
		 * @type {Panel}
		 */
		children: PropTypes.node,

		/**
		 * Index of the active panel
		 *
		 * @type {Number}
		 * @default 0
		 */
		index: PropTypes.number,

		/**
		 * Disable panel transitions
		 *
		 * @type {Boolean}
		 * @default false
		 */
		noAnimation: PropTypes.bool
	},

	defaultProps: {
		index: 0,
		noAnimation: false
	},

	styles: {
		css,
		className: 'viewport'
	},

	handlers: {
		onTransition: handle(forward('onTransition'), Spotlight.resume),
		onWillTransition: handle(forward('onWillTransition'), Spotlight.pause)
	},

	computed: {
		children: ({children, generateId}) => React.Children.map(children, (child, index) => {
			return React.cloneElement(child, {
				containerId: child.props.containerId || generateId(index, 'panel-container', Spotlight.remove),
				'data-index': index
			});
		}),
		enteringProp: ({noAnimation}) => noAnimation ? null : 'hideChildren'
	},

	render: ({arranger, children, enteringProp, index, noAnimation, ...rest}) => {
		delete rest.generateId;

		const count = React.Children.count(children);
		invariant(
			index === 0 && count === 0 || index < count,
			`Panels index, ${index}, is invalid for number of children, ${count}`
		);

		return (
			<ViewManager
				{...rest}
				arranger={arranger}
				component="main"
				duration={250}
				enteringDelay={100}
				enteringProp={enteringProp}
				index={index}
				noAnimation={noAnimation}
			>
				{children}
			</ViewManager>
		);
	}
});

export default ViewportBase;
export {
	ViewportBase as Viewport,
	ViewportBase
};
