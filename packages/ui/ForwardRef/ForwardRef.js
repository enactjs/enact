/**
 * Provides a HOC interface for `ref` forwarding.
 *
 * @module ui/ForwardRef
 * @exports	ForwardRef
 */

import hoc from '@enact/core/hoc';
import React from 'react';

/**
 * Default config for {@link ui/ForwardRef.ForwardRef}.
 *
 * @memberof ui/ForwardRef.ForwardRef
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Configures the prop name to pass the ref callback
	 *
	 * @type {String}
	 * @default 'forwardRef'
	 * @memberof ui/ForwardRef.ForwardRef.defaultConfig
	 */
	prop: 'forwardRef'
};

/**
 * Adapts [`React.forwardRef`](https://reactjs.org/docs/forwarding-refs.html) to be chainable with
 * other HOCs.
 *
 * The following examples are equivalent:
 *
 * ```
 * import ForwardRef from '@enact/ui/ForwardRef';
 * import Component from './Component';
 *
 * React.forwardRef((props, ref) => (
 * 	<Component {...props} setMyRef={ref} />
 * ));
 * ForwardRef({prop: 'setMyRef'}, Component);
 * ```
 *
 * @class ForwardRef
 * @memberof ui/ForwardRef
 * @hoc
 * @public
 */
const ForwardRef = hoc(defaultConfig, (config, Wrapped) => {
	const {prop} = config;

	return React.forwardRef((props, ref) => {
		const withRef = {
			...props,
			[prop]: ref
		};

		return (
			<Wrapped {...withRef} />
		);
	});
});

export default ForwardRef;
export {
	ForwardRef
};
