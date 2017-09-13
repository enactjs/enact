import {childrenEquals} from '@enact/core/util';
import hoc from '@enact/core/hoc';
import React from 'react';

const defaultConfig = {
	propComparators: {
		'*': (a, b) => a === b,
		children: childrenEquals
	}
};

const Pure = hoc(defaultConfig, (config, Wrapped) => {
	const {propComparators} = config;

	return class extends React.Component {
		static displayName = 'Pure'

		static propTypes = {}

		static defaultProps = {}

		shouldComponentUpdate (nextProps) {
			return this.hasChanged(this.props, nextProps, propComparators);
		}

		hasChanged (current, next, comparators) {
			const propKeys = Object.keys(current);
			const nextKeys = Object.keys(next);

			if (propKeys.length !== nextKeys.length) {
				return true;
			}

			const hasOwn = Object.prototype.hasOwnProperty.bind(current);
			for (let i = 0; i < nextKeys.length; i++) {
				const prop = nextKeys[i];
				const comp = comparators[prop] || comparators['*'];
				if (!hasOwn(prop) || !comp(current[prop], next[prop])) {
					return true;
				}
			}

			return false;
		}

		render () {
			return (
				<Wrapped {...this.props} />
			);
		}
	};
});

export default Pure;
export {
	Pure
};
