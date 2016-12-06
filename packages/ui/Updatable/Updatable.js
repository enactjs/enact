/**
 * Exports the {@link ui/Updatable.Updatable} Higher-order Component (HOC).
 *
 * @module ui/Updatable
 */

import React from 'react';

/**
 * {@link ui/Updatable.Updatable} is a Higher-order Component that adds
 * shouldComponentUpdate to its wrapped component.
 *
 * Usage:
 * ```
 * Updatable(updateFunction)(contextTypes)(WrappedComponent);
 * ```
 * @class Updatable
 * @memberof ui/Updatable
 * @ui
 * @public
 */
const UpdatableHOC = testFn => context => WrappedComponent => {
	return class extends React.Component {
		static displayName = 'Updatable'

		static contextTypes = context

		shouldComponentUpdate (nextProps, nextState, nextContext) {
			return testFn(this.props, nextProps, this.context, nextContext);
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
