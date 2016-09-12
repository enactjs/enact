import React from 'react';
import hoc from 'enact-core/hoc';
import {cap} from 'enact-core/util';

const defaultConfig = {
	toggle: 'onClick',
	prop: 'selected'
};

const ToggleableHoC = hoc(defaultConfig, (config, Wrapped) => {
	const defaultPropKey = 'default' + cap(config.prop);

	return class Toggleable extends React.Component {
		static propTypes = {
			[defaultPropKey]: React.PropTypes.bool,
			disabled: React.PropTypes.bool
		}

		static defaultProps = {
			[defaultPropKey]: false
		}

		constructor (props) {
			super(props);
			this.state = {
				selected: props[defaultPropKey]
			};
		}

		onToggle = () => {
			if (!this.props.disabled) {
				this.setState({selected: !this.state.selected});
			}
		}

		render () {
			const props = Object.assign({}, this.props);
			props[config.toggle] = this.onToggle;
			props[config.prop] = this.state.selected;
			delete props[defaultPropKey];

			return <Wrapped {...props} />;
		}
	};
});

export default ToggleableHoC;
export {ToggleableHoC as Toggleable};
