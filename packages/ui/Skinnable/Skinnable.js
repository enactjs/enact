/**
 * Exports the {@link ui/Skinnable.Skinnable} Higher-order Component (HOC).
 *
 * @module ui/Skinnable
 */

import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

const contextTypes = {
	skin: PropTypes.string
};

/**
 * Default config for {@link ui/Skinnable.Skinnable}.
 *
 * @memberof ui/Skinnable.Skinnable
 * @hocconfig
 * @public
 */
const defaultConfig = {
	/**
	 * An hash mapping the available skin names to their CSS class name. The keys are accepted as
	 * the only valid values for the `skin` prop on the wrapped component.
	 *
	 * @type {Object}
	 * @memberof ui/Skinnable.Skinnable.defaultConfig
	 */
	skins: null,

	/**
	 * Assign a default skin from the `skins` list. This will be used if the instantiator of the
	 * wrapped component provides no value to the `skin` prop.
	 *
	 * @type {String}
	 * @memberof ui/Skinnable.Skinnable.defaultConfig
	 */
	defaultSkin: null
};

/**
 * {@link ui/Skinnable.Skinnable} is a Higher-order Component that assigns skinning classes for the
 * purposes of styling children components.
 *
 * Use the config options to specify the skins your theme has. Set this up in your Theme's decorator
 * component to establish your supported skins.
 *
 * Example:
 * ```
 * App = Skinnable({
 * 	skins: {
 * 		dark: 'moonstone',
 * 		light: 'moonstone-light'
 * 	},
 * 	defaultTheme: 'dark'
 * }, App);
 * ```
 *
 * @class Skinnable
 * @memberof ui/Skinnable
 * @hoc
 * @public
 */
const Skinnable = hoc(defaultConfig, (config, Wrapped) => {
	const {skins, defaultSkin} = config;

	return class extends React.Component {
		static displayName = 'Skinnable'

		static propTypes = /** @lends ui/Skinnable.Skinnable.prototype */ {
			/**
			 * Select a skin by name. The list of available skins is established by the direct consumer
			 * of this component via the config options. This will typically be done once by the theme
			 * decorator, like [MoonstoneDecorator]{@link moonstone/MoonstoneDecorator} which will
			 * supply the list of skins.
			 *
			 * @type {String}
			 * @public
			 */
			skin: PropTypes.oneOf(skins)
		}

		static contextTypes = contextTypes;

		static childContextTypes = contextTypes;

		getChildContext () {
			return {
				skin: this.getSkin()
			};
		}

		getSkin () {
			return this.props.skin || this.context.skin || defaultSkin;
		}

		getClassName () {
			const skin = skins[this.getSkin()];
			let {className} = this.props;

			// only apply the skin class if it's set and different from the "current" skin as
			// defined by the value in context
			if (skin) {
				if (className) {
					className = `${skin} ${className}`;
				} else {
					className = skin;
				}
			}

			return className;
		}

		render () {
			return (
				<Wrapped
					{...this.props}
					className={this.getClassName()}
				/>
			);
		}
	};
});

export default Skinnable;
export {Skinnable};
