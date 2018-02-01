/**
 * Exports the {@link ui/Repeater.Repeater} component.
 *
 * @module ui/Repeater
 */

import React from 'react';
import PropTypes from 'prop-types';
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
		 * Component type to repeat. This can be a React component or a string describing a DOM
		 * node (e.g. `'div'`)
		 *
		 * @type {Component}
		 * @required
		 * @public
		 */
		childComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,

		/**
		 * An array of data to be mapped onto the `childComponent`. This supports two data types.
		 * If an array of strings is provided, the strings will be used in the generated
		 * `childComponent` as the readable text. If an array of objects is provided, each object
		 * will be spread onto the generated `childComponent` with no interpretation. You'll be
		 * responsible for setting properties like `disabled`, `className`, and setting the text
		 * content using the `children` key.
		 *
		 * NOTE: When an array of objects is provided, make sure unique `key` is assigned to each
		 * data. See https://fb.me/react-warning-keys for more information.
		 *
		 * @type {String[]|Object[]}
		 * @required
		 * @public
		 */
		children: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.string),
			PropTypes.arrayOf(PropTypes.shape({
				key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
			}))
		]).isRequired,

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
				let props = {};
				if (typeof data === 'object') {
					props = {...itemProps, ...data};
				} else if (childProp) {
					props = {key: index, ...itemProps, [childProp]: data};
				}
				if (indexProp) props[indexProp] = index;

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
