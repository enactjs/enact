
/**
 * Exports the {@link ui/internal/ComponentCollection.ComponentCollection} component.
 *
 * @module ui/internal/ComponentCollection
 * @private
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * {@link ui/ComponentCollection.ComponentCollection} is a stateless component that renders a collection
 * of components from a configuraable array of props.
 *
 * ```
 * // collection of components
 * const components = [{
 *     childComponent: 'div',
 *     childProp: 'children',
 *     children: [{
 *         childComponent: 'button',
 *         childProp: 'children',
 *         children: ['button in a div']
 *     },
 *     {
 *         childComponent: 'button',
 *         childProp: 'children',
 *         children: ['disabled button in a div'],
 *         itemProps: {disabled: true}
 *     }]
 * }];
 * ```
 *
 * ```
 * // render the component collection
 * <ComponentCollection>{components}</ComponentCollection>
 * ```
 *
 * @class Pure
 * @memberof ui/internal/ComponentCollection
 * @ui
 * @private
 */
const ComponentCollection = class extends React.Component {
	static displayName = 'ComponentCollection'

	static proptypes = {
		children: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.string),
			PropTypes.arrayOf(PropTypes.shape({
				childComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
				key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
				children: PropTypes.array,
				childProp: PropTypes.string,
				itemProps: PropTypes.object
			}))
		]).isRequired
	}

	static defaultProps = {
		childProp: 'children'
	}

	getChild = ({item, index}) => {
		let child;

		if (typeof item === 'object') {
			const {childComponent: Component, childProp, [childProp]: children, itemProps} = item;
			const props = {key: index, ...itemProps};
			child = <Component {...props}>{this.getChildren(children)}</Component>;
		} else {
			child = item;
		}
		return child;
	}

	getChildren = (data) => data.map((item, index) => this.getChild({item, index}))

	render () {
		return this.getChildren(this.props.children);
	}
};

export default ComponentCollection;
export {
	ComponentCollection
};
