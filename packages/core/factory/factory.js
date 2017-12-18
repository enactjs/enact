/**
 * Exports the {@link core/factory.factory} function for creating customizeable components.
 *
 * @module core/factory
 */

import css from './css';

/**
 * Invokes a factory feature
 *
 * @param	{String}	prop			Key for feature in config object
 * @param	{Function}	fn				Feature function
 * @param	{Object}	defaultConfig	Component default configuration
 * @param	{Object}	config			Custom configuration
 *
 * @returns	{*}							Result of the feature
 * @private
 */
const feature = function (prop, fn, defaultConfig, config) {
	const defaultValue = defaultConfig ? defaultConfig[prop] : null;
	const value = config ? config[prop] : null;
	return (defaultValue || value) ? fn(defaultValue, value) : null;
};

/**
 * Creates a factory function which reconciles a default configuration object (`defaultConfig`) and
 * a customized configuration object and provides the result to an executing function (`fn`). The
 * configuration objects are processed by features which determine how to reconcile the values from
 * each.
 *
 * Currently, `factory` only supports the `css` feature which expects its key to contain a map
 * of local class names to exported class names. When both maps contain matching keys, the class
 * names are joined together with a space.
 *
 * ```
 * import factory from '@enact/core/factory';
 * import kind from '@enact/core/kind';
 *
 * import componentCss from './Button.less';
 *
 * const ButtonFactory = factory({css: componentCss}, ({css}) => {
 * 	return kind({
 * 		name: 'Button',
 *
 *		// Since 'button' will be resolved against the combined `css` map, it can be overridden too
 * 		styles: {
 * 			css,
 * 			className: 'button'
 * 		},
 *
 *		// Component authors can also prevent overrides by using their css map directly as is done
 *		// with the `inner` class below
 * 		render: ({children, ...rest}) => (
 * 			<button {...rest}>
 * 				<div className={componentCss.inner}>
 * 					{children}
 * 				</div>
 * 			</button>
 * 		)
 * 	});
 * });
 *
 * // If `buttonCss` includes a `button` class, it will be appended to the `button` class of the
 * // `Button` component.
 * import buttonCss from './CustomButton.less';
 * CustomizedButton = ButtonFactory({css: buttonCss});
 *
 * <CustomizedButton />
 * ````
 *
 * @param	{Object}	defaultConfig	Default configuration object
 * @param	{Function}	fn				Executing function which receives the merged configuration
 *
 * @returns	{Function}					Factory function accepting the customized configuration
 *
 * @method factory
 * @memberof core/factory
 * @public
 */
const factory = (defaultConfig, fn) => (config) => {
	let componentConfig = defaultConfig;
	let authorConfig = config;
	let factoryFn = fn;

	// support omitting defaultConfig
	if (typeof defaultConfig === 'function') {
		factoryFn = defaultConfig;
		componentConfig = null;
	}

	return factoryFn({
		css: feature('css', css, componentConfig, authorConfig)
	});
};

export default factory;
export {factory};
