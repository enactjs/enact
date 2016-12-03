import React from 'react';

const UpdatableHOC = updateFn => context => WrappedComponent => {
	return class extends React.Component {
		static displayName = 'Updatable'

		static contextTypes = context

		shouldComponentUpdate (nextProps, nextState, nextContext) {
			return updateFn(this.props, nextProps, this.context, nextContext);
		}

		render () {
			return (
				<WrappedComponent {...this.props} />
			);
		}
	};
};

export default UpdatableHOC;
export {UpdatableHOC as Updatable};
