/* eslint-disable react/sort-prop-types */

/**
 * Exports the {@link ui/Pressable.Pressable} Higher-order Component (HOC).
 *
 * @module ui/Pressable
 */

import {forProp, forward, handle} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {cap} from '@enact/core/util';
import React from 'react';
import PropTypes from 'prop-types';
import warning from 'warning';

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

	return class Pressable extends React.Component {
		static propTypes = /** @lends ui/Pressable.Pressable.prototype */ {
			/**
			 * Default pressed state applied at construction when the pressed prop is `undefined` or
			 * `null`.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			[defaultPropKey]: PropTypes.bool,

			/**
			 * Current pressed state. When set at construction, the component is considered
			 * "controlled" and will only update its internal pressed state when updated by new
			 * props. If `undefined`, the component is "uncontrolled" and `Pressable` will manage
			 * the pressed state using callbacks defined by its configuration.
			 *
			 * @type {Boolean}
			 * @public
			 */
			[prop]: PropTypes.bool,

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
			let pressed = props[defaultPropKey];
			let controlled = false;

			if (prop in props) {
				if (props[prop] != null) {
					pressed = props[prop];
				}

				controlled = true;
			}

			this.state = {
				controlled,
				pressed
			};
		}

		componentWillReceiveProps (nextProps) {
			if (this.state.controlled) {
				const pressed = nextProps[prop];
				this.setState({pressed});
			} else {
				warning(
					!(prop in nextProps),
					`'${prop}' specified for an uncontrolled instance of Pressable and will be
					ignored. To make this instance of Pressable controlled, '${prop}' should be
					specified at creation.`
				);
			}
		}

		handle = handle.bind(this)

		updatePressed = (pressed) => {
			if (!this.state.controlled) {
				this.setState({pressed});
			}
		}

		handleDepress = (name) => this.handle(
			forward(name),
			forProp('disabled', false),
			(ev) => this.updatePressed(ev && ev.pressed || true)
		)

		handleRelease = (name) => this.handle(
			forward(name),
			forProp('disabled', false),
			() => this.updatePressed(false)
		)

		handleLeave = this.handle(
			forward(leave),
			forProp('disabled', false),
			() => this.updatePressed(false)
		)

		render () {
			const props = Object.assign({}, this.props);
			if (depress) {
				if (Array.isArray(depress)) {
					depress.forEach((name) => {
						props[name] = this.handleDepress(name);
					});
				} else {
					props[depress] = this.handleDepress(depress);
				}
			}

			if (release) {
				if (Array.isArray(release)) {
					release.forEach((name) => {
						props[name] = this.handleRelease(name);
					});
				} else {
					props[release] = this.handleRelease(release);
				}
			}

			if (leave) props[leave] = this.handleLeave;
			if (prop) props[prop] = this.state.pressed;
			delete props[defaultPropKey];

			return <Wrapped {...props} />;
		}
	};
});

export default PressableHOC;
export {PressableHOC as Pressable};
