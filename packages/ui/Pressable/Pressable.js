/**
 * Exports the {@link ui/Pressable.Pressable} Higher-order Component (HOC).
 *
 * @module ui/Pressable
 */

import {forProp, forward, handle} from '@enact/core/handle';
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
	 * @type {String}
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
	 * @type {String}
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
		}

		handle = handle.bind(this)

		handleDepress = this.handle(
			forward(depress),
			forProp('disabled', false),
			(ev) => this.setState({pressed: ev.pressed || true})
		)

		handleRelease = this.handle(
			forward(release),
			() => this.setState({pressed: false})
		)

		handleLeave = this.handle(
			forward(leave),
			() => this.setState({pressed: false})
		)

		render () {
			const props = Object.assign({}, this.props);
			if (depress) props[depress] = this.handleDepress;
			if (release) props[release] = this.handleRelease;
			if (leave) props[leave] = this.handleLeave;
			if (prop) props[prop] = this.state.pressed;
			delete props[defaultPropKey];

			return <Wrapped {...props} />;
		}
	};
});

export default PressableHOC;
export {PressableHOC as Pressable};
