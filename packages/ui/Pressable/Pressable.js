import React, {PropTypes} from 'react';
import hoc from 'enact-core/hoc';
import R from 'ramda';
import {cap} from 'enact-core/util';

const defaultConfig = {
	depress: 'onMouseDown',
	release: 'onMouseUp',
	keyDown: 'onKeyDown',
	keyUp: 'onKeyUp',
	prop: 'pressed'
};

const PressableHoC = hoc(defaultConfig, (config, Wrapped) => {
	const defaultPropKey = 'default' + cap(config.prop);

	return class Pressable extends React.Component {
		static propTypes = {

			/**
			* Whether or not the component is in a "pressed" state.
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
			disabled: PropTypes.bool,

			/**
			* The array of keycodes that the component should respond to, corresponding to when
			* `useEnterKey` is set to `true`.
			*
			* @type {Number[]}
			* @default [13, 16777221]
			* @public
			*/
			keyCodes: PropTypes.array,

			/**
			* Whether or not the component should respond to "enter" keypresses and update the
			* pressed state accordingly.
			*
			* @type {Boolean}
			* @default false
			* @public
			*/
			useEnterKey: PropTypes.bool
		}

		static defaultProps = {
			[defaultPropKey]: false,
			disabled: false,
			keyCodes: [13, 16777221],
			useEnterKey: false
		}

		constructor (props) {
			super(props);
			this.state = {
				pressed: props[defaultPropKey]
			};
		}

		onMouseDown = (e) => {
			if (!this.props.disabled) {
				this.setState({pressed: e.pressed || true, keyCode: null});
			}
		}

		onMouseUp = () => {
			this.setState({pressed: false, keyCode: null});
		}

		onKeyDown = (e) => {
			const keyCode = e.nativeEvent.keyCode;
			if (!this.props.disabled && !this.state.keyCode && R.contains(keyCode, this.props.keyCodes)) {
				this.setState({pressed: true, keyCode});
			}
		}

		onKeyUp = (e) => {
			const keyCode = e.nativeEvent.keyCode;
			if (keyCode === this.state.keyCode) {
				this.setState({pressed: false, keyCode: null});
			}
		}

		render () {
			const props = Object.assign({}, this.props);
			props[config.depress] = this.onMouseDown;
			props[config.release] = this.onMouseUp;
			props[config.prop] = this.state.pressed;
			if (props.useEnterKey) {
				props[config.keyDown] = this.onKeyDown;
				props[config.keyUp] = this.onKeyUp;
			}
			delete props.useEnterKey;
			delete props.keyCodes;
			delete props[defaultPropKey];

			return <Wrapped {...props} />;
		}
	};
});

export default PressableHoC;
export {PressableHoC as Pressable};
