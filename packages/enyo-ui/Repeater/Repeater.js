import R from 'ramda';
import React, {PropTypes} from 'react';
import kind from 'enyo-core/kind';

const Repeater = kind({
	name: 'Repeater',

	propTypes: {
		children: PropTypes.array.isRequired,
		type: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
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
		children: ({type: Type, children, childProp, indexProp, itemProps}) => {
			return children.map((data, index) => {
				const props = {...itemProps};
				if (indexProp) props[indexProp] = index;
				if (childProp) props[childProp] = data;

				return <Type {...props} />;
			});
		}
	},

	render: (props) => {
		const rest = R.omit(['indexProp', 'childProp', 'itemProps', 'type'], props);
		return <span {...rest} />;
	}
});

export default Repeater;
export {Repeater, Repeater as RepeaterBase};
