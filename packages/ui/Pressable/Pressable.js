/**
 * Exports the {@link ui/Pressable.Pressable} Higher-order Component (HOC).
 *
 * @module ui/Pressable
 */

import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {cap} from '@enact/core/util';
import React, {PropTypes} from 'react';

/**
 * Default config for {@link ui/Pressable.Pressable}
 *
 * @memberof ui/Pressable.Pressable
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Configures the event name that activates the Pressable
	 *
	 * @type {String|Array}
	 * @default 'onMouseDown'
	 * @memberof ui/Pressable.Pressable.defaultConfig
	 */
	depress: 'onMouseDown',

	/**
	 * Configures the event name that deactivates the Pressable when onMouseLeave is triggered
	 *
	 * @type {String}
	 * @default 'onMouseLeave'
	 * @memberof ui/Pressable.Pressable.defaultConfig
	 */
	leave: 'onMouseLeave',

	/**
	 * Configures the event name that deactivates the Pressable
	 *
	 * @type {String|Array}
	 * @default 'onMouseUp'
	 * @memberof ui/Pressable.Pressable.defaultConfig
	 */
	release: 'onMouseUp',

	/**
	 * Configures the property that is passed to the wrapped component when pressed
	 *
	 * @type {String}
	 * @default 'pressed'
	 * @memberof ui/Pressable.Pressable.defaultConfig
	 */
	prop: 'pressed'
};

/**
 * {@link ui/Pressable.Pressable} is a Higher-order Component that applies a 'Pressable' behavior
 * to its wrapped component.  Its default event and property can be configured when applied to a component.
 *
 * By default, Pressable applies the `pressed` property on mouseDown and removes it on mouseUp.
 *
 * @class Pressable
 * @memberof ui/Pressable
 * @hoc
 * @public
 */
const PressableHOC = hoc(defaultConfig, (config, Wrapped) => {
	const {depress, release, prop, leave} = config;
	const defaultPropKey = 'default' + cap(prop);
	const forwardDepress = forward(depress);
	const forwardRelease = forward(release);

	return class Pressable extends React.Component {
		static propTypes = /** @lends ui/Pressable.Pressable.prototype */ {
			/**
			 * Whether or not the component is in a "pressed" state when first rendered.
			 * *Note that this property name can be changed by the config. By default it is `defaultPressed`.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			[defaultPropKey]: React.PropTypes.bool,

			/**
			 * Whether or not the component is in a disabled state.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			disabled: PropTypes.bool
		}

		static defaultProps = {
			[defaultPropKey]: false,
			disabled: false
		}

		constructor (props) {
			super(props);
			this.state = {
				pressed: props[defaultPropKey]
			};
			this.eventHandlers = {};
			if (typeof depress === 'string') {
				this.eventHandlers[depress] = this.onDepress;
			} else if (Array.isArray(depress)) {
				depress.forEach((dep) => {
					this.eventHandlers[dep] = this.onDepress;
				});
			}
			if (typeof release === 'string') {
				this.eventHandlers[release] = this.onRelease;
			} else if (Array.isArray(release)) {
				release.forEach((rel) => {
					this.eventHandlers[rel] = this.onRelease;
				});
			}
			if (leave) {
				this.eventHandlers[leave] = this.onMouseLeave;
			}
		}

		onDepress = (ev) => {
			if (!this.props.disabled) {
				this.setState({pressed: ev.pressed || true});
			}
			forwardDepress(ev, this.props);
		}

		onRelease = (ev) => {
			this.setState({pressed: false});
			forwardRelease(ev, this.props);
		}

		onMouseLeave = () => {
			this.setState({pressed: false});
		}

		render () {
			const props = Object.assign({}, this.props, this.eventHandlers);
			if (prop) props[prop] = this.state.pressed;
			delete props[defaultPropKey];

			return <Wrapped {...props} />;
		}
	};
});

export default PressableHOC;
export {PressableHOC as Pressable};
