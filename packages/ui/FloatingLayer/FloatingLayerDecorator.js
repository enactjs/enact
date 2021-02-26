/*
 * A higher-order component that adds a FloatingLayer adjacent to wrapped component.
 */

import hoc from '@enact/core/hoc';

import {FloatingLayerContext, useFloatingLayerDecorator} from './useFloatingLayerDecorator';

/**
 * Default config for {@link ui/FloatingLayer.FloatingLayerDecorator}.
 *
 * @memberof ui/FloatingLayer.FloatingLayerDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Element Id of the floatLayer
	 *
	 * @type {String}
	 * @default 'floatLayer'
	 * @public
	 * @memberof ui/FloatingLayer.FloatingLayerDecorator.defaultConfig
	 */
	floatLayerId: 'floatLayer',

	/**
	 * Class name to be applied to wrapped component.

	 * It can be used when you want to only apply
	 * certain styles to the wrapped component and not to the float layer.
	 *
	 * @type {String}
	 * @default ''
	 * @public
	 * @memberof ui/FloatingLayer.FloatingLayerDecorator.defaultConfig
	 */
	wrappedClassName: ''
};

/**
 * A higher-order component that adds a FloatingLayer adjacent to the wrapped component.
 *
 * Any classes passed to the FloatingLayerDecorator will be applied to a wrapper surrounding the
 * wrapped component and the floating layer. If specified in the config, `wrappedClassName` will be
 * passed as `className` to the wrapped component.
 *
 * @class FloatingLayerDecorator
 * @memberof ui/FloatingLayer
 * @hoc
 * @public
 */
const FloatingLayerDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {floatLayerId, wrappedClassName} = config;

	// eslint-disable-next-line no-shadow
	function FloatingLayerDecorator (props) {
		const {className, ...rest} = props;
		const hook = useFloatingLayerDecorator({className, floatLayerId});

		return hook.provideFloatingLayer(
			<Wrapped key="floatWrapped" {...rest} className={wrappedClassName} />
		);
	}

	return FloatingLayerDecorator;
});

export default FloatingLayerDecorator;
export {
	FloatingLayerContext,
	FloatingLayerDecorator,
	useFloatingLayerDecorator
};
