/**
 * Exports the {@link module:@enact/ui/Pressable~Pressable} Higher-order Component (HOC).
 *
 * @module @enact/ui/Pressable
 */

import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {cap} from '@enact/core/util';
import React, {PropTypes} from 'react';

const defaultConfig = {
	/**
	 * Configures the event name that activates the Pressable
	 *
	 * @type {String}
	 * @default 'onMouseDown'
	 */
	depress: 'onMouseDown',

	/**
	 * Configures the event name that deactivates the Pressable
	 *
	 * @type {String}
	 * @default 'onMouseUp'
	 */
	release: 'onMouseUp',

	/**
	 * Configures the property that is passed to the wrapped component when pressed
	 *
	 * @type {String}
	 * @default 'pressed'
	 */
	prop: 'pressed'
};

/**
 * {@link module:@enact/ui/Pressable~Pressable} is a Higher-order Component that applies a 'Pressable' behavior
 * to its wrapped component.  Its default event and property can be configured when applied to a component.
 *
 * By default, Pressable applies the `pressed` property on mouseDown and removes it on mouseUp.
 *
 * @class Pressable
 * @ui
 * @public
 */
const PressableHOC = hoc(defaultConfig, (config, Wrapped) => {
	const {depress, release, prop} = config;
	const defaultPropKey = 'default' + cap(prop);
	const forwardDepress = forward(depress);
	const forwardRelease = forward(release);

	return class Pressable extends React.Component {
		static propTypes = {
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

		onMouseDown = (ev) => {
			if (!this.props.disabled) {
				this.setState({pressed: ev.pressed || true});
			}
			forwardDepress(ev, this.props);
		}

		onMouseUp = (ev) => {
			this.setState({pressed: false});
			forwardRelease(ev, this.props);
		}

		render () {
			const props = Object.assign({}, this.props);
			if (depress) props[depress] = this.onMouseDown;
			if (release) props[release] = this.onMouseUp;
			if (prop) props[prop] = this.state.pressed;
			delete props[defaultPropKey];

			return <Wrapped {...props} />;
		}
	};
});

export default PressableHOC;
export {PressableHOC as Pressable};
