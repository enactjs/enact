import hoc from '@enact/core/hoc';
import React from 'react';

let GlobalId = 0;


/**
 * Default config for {@link moonstone/Panels.IdProvider}
 *
 * @hocconfig
 * @memberof moonstone/Panels.IdProvider
 */
const defaultConfig = {
	/**
	 * Callback for each generated identifier when unmounting
	 *
	 * @type {Function}
	 * @memberof moonstone/Panels.IdProvider.defaultConfig
	 */
	onUnmount: null,

	/**
	 * Optional prefix for the identifier
	 *
	 * @type {String}
	 * @default ''
	 * @memberof moonstone/Panels.IdProvider.defaultConfig
	 */
	prefix: '',

	/**
	 * Prop to pass the identifier generation function
	 *
	 * @type {String}
	 * @default generateId
	 * @memberof moonstone/Panels.IdProvider.defaultConfig
	 */
	prop: 'generateId'
};

/**
 * Higher-order Component that generates globally-unique identifiers
 *
 * @class IdProvider
 * @hoc
 * @private
 * @memberof moonstone/Panels
 */
const IdProvider = hoc(defaultConfig, (config, Wrapped) => {
	const {onUnmount, prefix, prop} = config;

	return class extends React.Component {
		static displayName = 'IdProvider'

		constructor () {
			super();

			this.ids = {};
		}

		generateId = (key) => {
			// if an id has been generated for the key, return it
			if (key in this.ids) {
				return this.ids[key];
			}

			// otherwise generate a new id (with an optional prefix), cache it, and return it
			const id = `${prefix}${++GlobalId}`;
			this.ids[typeof key === 'undefined' ? `generated-${id}` : key] = id;

			return id;
		}

		componentWillUnmount () {
			if (typeof onUnmount === 'function') {
				// Call the onUnmount handler for each generated id (note: not the key)
				for (const id in this.ids) {
					onUnmount(this.ids[id]);
				}
			}
		}

		render () {
			let props = this.props;

			if (prop) {
				props = {
					...this.props,
					[prop]: this.generateId
				};
			}

			return (
				<Wrapped {...props} />
			);
		}
	};
});

export default IdProvider;
export {
	IdProvider
};
