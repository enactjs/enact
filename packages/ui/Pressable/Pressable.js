import hoc from 'enact-core/hoc';
import {cap} from 'enact-core/util';
import React, {PropTypes} from 'react';

const defaultConfig = {
	depress: 'onMouseDown',
	release: 'onMouseUp',
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
		}

		onMouseUp = () => {
			this.setState({pressed: false});
		}

		render () {
			const props = Object.assign({}, this.props);
			if (config.depress) props[config.depress] = this.onMouseDown;
			if (config.release) props[config.release] = this.onMouseUp;
			if (config.prop) props[config.prop] = this.state.pressed;
			delete props[defaultPropKey];

			return <Wrapped {...props} />;
		}
	};
});

export default PressableHoC;
export {PressableHoC as Pressable};
