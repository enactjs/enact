/**
 * A higher-order component interface for `ref` forwarding.
 *
 * @module ui/ForwardRef
 * @exports	ForwardRef
 */

import hoc from '@enact/core/hoc';
import {forwardRef} from 'react';

/**
 * Default config for {@link ui/ForwardRef.ForwardRef}.
 *
 * @memberof ui/ForwardRef.ForwardRef
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * The prop name to pass the ref callback
	 *
	 * @type {String}
	 * @default 'forwardRef'
	 * @memberof ui/ForwardRef.ForwardRef.defaultConfig
	 */
	prop: 'forwardRef'
};

/**
 * A higher-order component that adapts [`React.forwardRef`](https://react.dev/reference/react/forwardRef)
 * to be chainable with other HOCs.
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

	return forwardRef((props, ref) => {
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
