import React, {PropTypes} from 'react';
import kind from 'enact-core/kind';

const Repeater = kind({
	name: 'Repeater',

	propTypes: {
		childComponent: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
		children: PropTypes.array.isRequired,
		childProp: PropTypes.string,
		indexProp: PropTypes.string,
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

export default Repeater;
export {Repeater, Repeater as RepeaterBase};
