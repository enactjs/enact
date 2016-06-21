import R from 'ramda';
import React from 'react';

import '../src/glue';
import $L from '../src/$L';

// Should be in enyo-core
const hoc = (defaultConfig, hawk) => (config, maybeWrapped) => {
	if (typeof config === 'function') {
		return hawk(defaultConfig, config);
	} else {
		const cfg = Object.assign({}, defaultConfig, config);
		if (typeof maybeWrapped === 'function') {
			return hawk(cfg, maybeWrapped);
		} else {
			return (Wrapped) => hawk(cfg, Wrapped);
		}
	}
};

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
