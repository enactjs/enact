import hoc from '@enact/core/hoc';

import useId from './useId';

/**
 * Default config for {@link ui/IdProvider.IdProvider}
 *
 * @hocconfig
 * @memberof ui/IdProvider.IdProvider
 */
const defaultConfig = {
	/**
	 * Prop to pass the identifier generation function
	 *
	 * @type {String}
	 * @default generateId
	 * @memberof ui/IdProvider.IdProvider.defaultConfig
	 */
	generateProp: 'generateId',

	/**
	 * Prop to pass the identifier
	 *
	 * @type {String}
	 * @default id
	 * @memberof ui/IdProvider.IdProvider.defaultConfig
	 */
	idProp: 'id',

	/**
	 * Optional prefix for the identifier
	 *
	 * @type {String}
	 * @default 'c_'
	 * @memberof ui/IdProvider.IdProvider.defaultConfig
	 */
	prefix: 'c_'
};

/**
 * A higher-order component that generates globally-unique identifiers
 *
 * @class IdProvider
 * @hoc
 * @private
 * @memberof ui/IdProvider
 */
const IdProvider = hoc(defaultConfig, (config, Wrapped) => {
	const {generateProp, idProp, prefix} = config;

	// eslint-disable-next-line no-shadow
	function IdProvider (props) {
		const updated = {...props};
		const {generateId} = useId({prefix});

		if (generateProp) {
			updated[generateProp] = generateId;
		}

		if (idProp && !updated[idProp]) {
			updated[idProp] = generateId();
		}

		return (
			<Wrapped {...updated} />
		);
	}

	return IdProvider;
});

export default IdProvider;
export {
	IdProvider,
	useId
};
