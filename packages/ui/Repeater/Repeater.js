/**
 * A repeater component.
 *
 * @module ui/Repeater
 * @exports Repeater
 */

import kind from '@enact/core/kind';
import EnactPropTypes from '@enact/core/internal/prop-types';
import PropTypes from 'prop-types';
import React from 'react';

import ForwardRef from '../ForwardRef';

/**
 * A stateless component that stamps out copies of `childComponent`, without
 * [RepeaterDecorator](ui/Repeater.RepeaterDecorator) applied.
 *
 * @class RepeaterBase
 * @memberof ui/Repeater
 * @ui
 * @public
 */
const RepeaterBase = kind({
	name: 'Repeater',

	propTypes: /** @lends ui/Repeater.RepeaterBase.prototype */ {
		/**
		 * Component type to repeat.
		 *
		 * This can be a React component or a string describing a DOM node (e.g. `'div'`).
		 *
		 * @type {String|Component}
		 * @required
		 * @public
		 */
		childComponent: EnactPropTypes.renderable.isRequired,

		/**
		 * An array of data to be mapped onto the `childComponent`.
		 *
		 * This supports two data types. If an array of strings is provided, the strings will be used
		 * in the generated `childComponent` as the readable text. If an array of objects is provided,
		 * each object will be spread onto the generated `childComponent` with no interpretation.
		 * You'll be responsible for setting properties like `disabled`, `className`, and setting the
		 * text content using the `children` key.
		 *
		 * > **NOTE**: When an array of objects is provided, make sure a unique `key` is assigned to each
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
		 * The property on each `childComponent` that receives the data in `children`.
		 *
		 * @type {String}
		 * @default 'children'
		 * @public
		 */
		childProp: PropTypes.string,

		/**
		 * Component type to wrap around all of the repeated elements.
		 *
		 * This can be a string describing a DOM node or React component (e.g. `'div'` or `Layout`).
		 *
		 * @type {String|Component}
		 * @default 'span'
		 * @public
		 */
		component: EnactPropTypes.renderable,

		/**
		 * Called with a reference to [component]{@link ui/Repeater.Repeater#component}
		 *
		 * @type {Function}
		 * @private
		 */
		componentRef: PropTypes.func,

		/**
		 * The property on each `childComponent` that receives the index of the item in the `Repeater`.
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
		childProp: 'children',
		component: 'span',
		indexProp: 'data-index'
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

	render: ({component: Component, componentRef, ...rest}) => {
		delete rest.childComponent;
		delete rest.childProp;
		delete rest.indexProp;
		delete rest.itemProps;

		return <Component ref={componentRef} role="list" {...rest} />;
	}
});

/**
 * Applies Repeater behaviors.
 *
 * @hoc
 * @memberof ui/Repeater
 * @mixes ui/ForwardRef.ForwardRef
 * @public
 */
const RepeaterDecorator = ForwardRef({prop: 'componentRef'});

/**
 * A stateless component that stamps out copies of `childComponent`.
 *
 * @class Repeater
 * @memberof ui/Repeater
 * @extends ui/Repeater.RepeaterBase
 * @mixes ui/Repeater.RepeaterDecorator
 * @ui
 * @public
 */
const Repeater = RepeaterDecorator(RepeaterBase);

export default Repeater;
export {
	Repeater,
	RepeaterBase
};
