/**
 * Exports the {@link module:@enact/ui/Repeater~Repeater} and {@link module:@enact/ui/Repeater~RepeaterBase}
 * components.  The default export is {@link module:@enact/ui/Repeater~Repeater}. `Repeater` is stateless
 * and is the same as `RepeaterBase`.
 *
 * @module @enact/ui/Repeater
 */

import React, {PropTypes} from 'react';
import kind from '@enact/core/kind';

/**
 * {@link module:@enact/ui/Repeater~RepeaterBase} is a stateless component that supports single-select of
 * its child items via configurable properties and events.
 *
 * @class RepeaterBase
 * @ui
 * @public
 */
const RepeaterBase = kind({
	name: 'Repeater',

	propTypes: {
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
		// eslint-disable-next-line react/display-name, react/prop-types
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

		return <span {...props} />;
	}
});

export default RepeaterBase;
export {RepeaterBase as Repeater, RepeaterBase};
