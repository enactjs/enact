import hoc from 'enact-core/hoc';
import React, {PropTypes} from 'react';

const defaultConfig = {
	depress: 'onMouseDown',
	release: 'onMouseUp',
	prop: 'pressed'
};

const PressableHoC = hoc(defaultConfig, (config, Wrapped) => {
	return class Pressable extends React.Component {
		static propTypes = {
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
			disabled: false
		}

		constructor (props) {
			super(props);
			this.state = {
				pressed: false
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
			delete props.keyCodes;

			return <Wrapped {...props} />;
		}
	};
});

export default PressableHoC;
export {PressableHoC as Pressable};
