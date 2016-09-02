import hoc from 'enyo-core/hoc';
import R from 'ramda';
import React from 'react';

import '../src/glue';
import $L from '../src/$L';

const Tr = hoc({keys: ['children']}, (config, Wrapped) => {
	const keys = config.keys;
	const str = (s) => s ? $L(s).toString() : '';
	const tr = R.compose(R.map(str), R.pick(keys));

	const TrHoc = (props) => {
		return React.createElement(Wrapped, R.merge(props, tr(props)));
	};

	// TODO: ifdev
	const propType = React.PropTypes.string;
	TrHoc.propTypes = keys.reduce((propTypes, key) => {
		propTypes[key] = propType;
		return propTypes;
	}, {});

	TrHoc.displayName = 'Tr';

	return TrHoc;
});

export default Tr;
export {Tr};
