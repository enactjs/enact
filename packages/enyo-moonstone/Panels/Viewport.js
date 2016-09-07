import kind from 'enyo-core/kind';
import ViewManager, {shape} from 'enyo-ui/ViewManager';
import React from 'react';

import css from './Panels.less';

/**
 * The container for a set of Panels
 *
 * @class Viewport
 */
const Viewport = kind({
	name: 'Viewport',

	propTypes: {
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
		index: 0
	},

	styles: {
		css,
		classes: 'viewport'
	},

	render: ({noAnimation, arranger, children, classes, index, ...rest}) => (
		<ViewManager
			{...rest}
			noAnimation={noAnimation}
			arranger={arranger}
			className={classes}
			duration={300}
			index={index}
			component="main"
		>
			{children}
		</ViewManager>
	)
});

export default Viewport;
export {Viewport};
