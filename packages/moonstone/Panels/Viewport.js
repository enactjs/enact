import {forward, withArgs as handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import ViewManager, {shape} from '@enact/ui/ViewManager';
import invariant from 'invariant';
import React from 'react';
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
		children: React.PropTypes.node,

		/**
		 * Index of the active panel
		 *
		 * @type {Number}
		 * @default 0
		 */
		index: React.PropTypes.number,

		/**
		 * Disable panel transitions
		 *
		 * @type {Boolean}
		 * @default false
		 */
		noAnimation: React.PropTypes.bool
	},

	defaultProps: {
		index: 0,
		noAnimation: false
	},

	styles: {
		css,
		className: 'viewport'
	},

	computed: {
		children: ({children}) => React.Children.map(children, (child, index) => {
			return React.cloneElement(child, {'data-index': index});
		}),
		enteringProp: ({noAnimation}) => noAnimation ? null : 'entering',
		handleTransition: handle(forward('onTransition'), Spotlight.resume),
		handleWillTransition: handle(forward('onWillTransition'), Spotlight.pause)
	},

	render: ({arranger, children, enteringProp, handleTransition, handleWillTransition, index, noAnimation, ...rest}) => {
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
				duration={200}
				enteringDelay={150}
				enteringProp={enteringProp}
				index={index}
				noAnimation={noAnimation}
				onTransition={handleTransition}
				onWillTransition={handleWillTransition}
			>
				{children}
			</ViewManager>
		);
	}
});

export default ViewportBase;
export {ViewportBase as Viewport, ViewportBase};
