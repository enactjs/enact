import R from 'ramda';
import React from 'react';
import kind from 'enact-core/kind';

// Pick the Groupable-specific props into a 'private' itemProps key to be extracted by Groupable
// before passing the remaining on to the repeated `type`
const pickGroupableProps = R.compose(
	R.objOf('$$Groupable'),
	R.pick(['activate', 'childProp', 'index', 'indexProp', 'onActivate', 'selectedProp', 'type'])
);

const Groupable = kind({
	displayName: 'Groupable',

	render: (props) => {
		const {
			$$Groupable: {
				activate,
				childProp,
				index: selectedIndex,
				indexProp,
				onActivate,
				selectedProp,
				type: Type
			},
			...rest
		} = props;

		const index = rest[indexProp];
		const data = rest[childProp];
		const selected = index === selectedIndex;
		if (selectedProp) rest[selectedProp] = selected;
		if (activate) rest[activate] = () => onActivate({index, data});

		return <Type {...rest} />;
	}
});

export default Groupable;
export {Groupable, pickGroupableProps};
