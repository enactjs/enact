import hoc from '@enact/core/hoc';
import React, {Component} from 'react';

const ScrollStrategyJS = hoc((config, Wrapped) => {
	return class extends Component {
		static displayName = 'ScrollStrategyJS'

		render () {
			return <Wrapped {...this.props} />;
		}
	};
});

export default ScrollStrategyJS;
export {
	ScrollStrategyJS
};
