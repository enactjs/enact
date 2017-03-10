/**
 * Exports the {@link ui/Repeater.Repeater} component.
 *
 * @module ui/Repeater
 */

import React, {PropTypes} from 'react';
import kind from '@enact/core/kind';

/**
 * {@link ui/Repeater.Repeater} is a stateless component that stamps out copies of
 * `childComponent`
 *
 * @class Repeater
 * @memberof ui/Repeater
 * @ui
 * @public
 */
const RepeaterBase = kind({
	name: 'Repeater',

	propTypes: /** @lends ui/Repeater.Repeater.prototype */ {
		/**
		 * Component type to repeat. This can be a React component or a string describing a DOM node (e.g. `'div'`)
		 *
		 * @type {Element}
		 * @public
		 */
		childComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,

		/**
		 * An array of data to be mapped onto the `childComponent`.  For example, an array of strings.
		 *
		 * @type {Array}
		 * @public
		 */
		children: PropTypes.array.isRequired,

		/**
		 * The property on each `childComponent` that receives the data in `children`
		 *
		 * @type {String}
		 * @default 'children'
		 * @public
		 */
		childProp: PropTypes.string,

		/**
		 * The property on each `childComponent` that receives the index of the item in the Repeater
		 *
		 * @type {String}
		 * @default 'data-index'
		 * @public
		 */
		indexProp: PropTypes.string,

		/**
		 * An object containing properties to be passed to each child.
		 *
		 * @type {Object}
		 * @public
		 */
		itemProps: PropTypes.object
	},

	defaultProps: {
		indexProp: 'data-index',
		childProp: 'children'
	},

	computed: {
		children: ({childComponent: Component, children, childProp, indexProp, itemProps}) => {
			return children.map((data, index) => {
				const props = {...itemProps};
				if (indexProp) props[indexProp] = index;
				if (childProp) props[childProp] = data;

				return <Component {...props} />;
			});
		}
	},

	render: (props) => {
		delete props.childComponent;
		delete props.childProp;
		delete props.indexProp;
		delete props.itemProps;

		return <span role="list" {...props} />;
	}
});

export default RepeaterBase;
export {RepeaterBase as Repeater, RepeaterBase};
