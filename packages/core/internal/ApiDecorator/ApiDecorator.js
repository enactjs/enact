/**
 * Provides the `ApiDecorator` Higher-order component
 *
 * @module core/internal/ApiDecorator
 * @private
 */

import invariant from 'invariant';
import React from 'react';

import hoc from '../../hoc';

// Invokes `name` on `provider` with `args`
const invoke = (provider, name, args) => {
	if (provider) {
		const fn = provider[name];
		if (typeof fn === 'function') {
			return provider[name](...args);
		}
	}
};

// Gets a property from `provider`
const get = (provider, name) => {
	if (provider) {
		return provider[name];
	}
};

// Sets a property on `provider`
const set = (provider, name, value) => {
	if (provider) {
		return (provider[name] = value);
	}
};


/**
 * Default config for {@link core/internal/ApiDecorator.ApiDecorator}.
 *
 * @memberof core/internal/ApiDecorator.ApiDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Configures the API endpoints to be exposed
	 *
	 * @type {String[]}
	 * @required
	 * @memberof core/internal/ApiDecorator.ApiDecorator.defaultConfig
	 */
	api: null
};

/**
 * {@link core/internal/ApiDecorator.ApiDecorator} is a Higher-order component that exposes an
 * imperative API for a contained component. ApiDecorator accepts an array of API endpoints in the
 * `api` config parameter. Each is then mapped to the underlying component instance as either a
 * function call or property getter/setter pair. The component passes a reference to itself to the
 * ApiDecorator by a `setApiProvider` prop added by the HOC.
 *
 * ```
 * import ApiDecorator from '@enact/core/internal/ApiDecorator';
 *
 * const MyComponent = class extends React.Component {
 * 	static displayName = 'MyComponent';
 *
 * 	doSomething = () => {
 * 	}
 * }
 *
 * @class ApiDecorator
 * @memberof core/internal/ApiDecorator
 * @hoc
 * @private
 */
const ApiDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {api} = config;

	invariant(
		api != null,
		'ApiDecorator: api is a required config property'
	);

	return class extends React.Component {
		static displayName = 'ApiDecorator';

		setProvider = (provider) => {
			api.forEach(key => {
				if (this[key]) {
					throw new Error(`API endpoint, ${key}, already exists`);
				}

				if (typeof provider[key] === 'function') {
					this[key] = (...args) => invoke(provider, key, args);
				} else {
					Object.defineProperty(this, key, {
						get: () => get(provider, key),
						set: (v) => set(provider, key, v),
						enumerable: true
					});
				}
			});
		}

		render () {
			return <Wrapped setApiProvider={this.setProvider} {...this.props} />;
		}
	};
});

export default ApiDecorator;
export {
	ApiDecorator
};
