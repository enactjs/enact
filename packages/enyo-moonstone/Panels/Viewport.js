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
		 * Panel transitions will be animated when `true`
		 *
		 * @type {Boolean}
		 * @default true
		 */
		animate: React.PropTypes.bool,

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
		index: React.PropTypes.number
	},

	defaultProps: {
		animate: true,
		index: 0
	},

	styles: {
		css,
		classes: 'viewport'
	},

	render: ({animate, arranger, children, classes, index, ...rest}) => (
		<ViewManager
			{...rest}
			animate={animate}
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
