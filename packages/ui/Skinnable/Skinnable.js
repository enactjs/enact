/**
 * Exports the {@link ui/Skinnable.Skinnable} higher-order component (HOC).
 *
 * This is the base-level implementation of this component. It will typically never be accessed
 * directly, and only be instantiated with a configuration once inside a visual library like
 * {@link moonstone/Skinnable}. Interface libraries will supply a set of supported skins which will
 * be accessible to their components.
 *
 * @module ui/Skinnable
 * @exports Skinnable
 * @exports withSkinnableProps
 * @public
 */

import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';
import {contextTypes as stateContextTypes, Publisher, Subscription} from '@enact/core/internal/PubSub';
import React from 'react';

const contextTypes = {
	skin: PropTypes.string
};

const combinedContextTypes = {
	...stateContextTypes,
	...contextTypes
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
	 * A hash mapping the available skin names to their CSS class name. The keys are accepted as
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
 * [Skinnable]{@link ui/Skinnable.Skinnable} is a higher-order component (HOC) that assigns skinning
 * classes for the purposes of styling children components.
 *
 * Use the config options to specify the skins your theme has. Set this up in your theme's decorator
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
			skin: PropTypes.oneOf(Object.keys(skins))
		}

		static contextTypes = combinedContextTypes;

		static childContextTypes = combinedContextTypes;

		constructor () {
			super();

			this.state = {};
		}

		getChildContext () {
			return {
				skin: this.determineSkin(this.props.skin, this.state.skin),
				Subscriber: this.publisher.getSubscriber()
			};
		}

		componentWillMount () {
			this.publisher = Publisher.create('skin', this.context.Subscriber);
			this.publisher.publish({
				skin: this.determineSkin(this.props.skin, this.state.skin)
			});

			if (this.context.Subscriber) {
				this.context.Subscriber.subscribe('skin', this.handleSubscription);
			}
		}

		componentWillReceiveProps (nextProps) {
			if (this.props.skin !== nextProps.skin) {
				const skin = this.determineSkin(nextProps.skin, this.state.skin);
				this.updateSkin(skin);
			}
		}

		componentWillUnmount () {
			if (this.context.Subscriber) {
				this.context.Subscriber.unsubscribe('skin', this.handleSubscription);
			}
		}

		handleSubscription = ({message}) => {
			const skin = this.determineSkin(this.props.skin, message.skin);
			this.updateSkin(skin);
		}

		updateSkin (skin) {
			if (skin !== this.state.skin) {
				const state = {skin};

				this.setState(state);
				this.publisher.publish(state);
			}
		}

		determineSkin (authorSkin, parentSkin) {
			return authorSkin || defaultSkin || parentSkin;
		}

		getClassName () {
			const skin = skins[this.determineSkin(this.props.skin, this.state.skin)];
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
			const {...props} = this.props;
			delete props.skin;
			return (
				<Wrapped
					{...props}
					className={this.getClassName()}
				/>
			);
		}
	};
});

/**
 * Occasionally, there's a case where context isn't available or your component only updates on
 * specific props changes. This HOC supplies the relevant context state values as props. In this
 * case, `skin` is avaliable as a prop to the wrapped component.
 *
 * @class withSkinnableProps
 * @memberof ui/Skinnable
 * @hoc
 * @public
 */
const withSkinnableProps = Subscription({
	channels: ['skin'],
	mapMessageToProps: (channel, {skin}) => ({skin})
});


export default Skinnable;
export {Skinnable, withSkinnableProps};
