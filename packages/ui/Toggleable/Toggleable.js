import R from 'ramda';
import React from 'react';
import hoc from 'enact-core/hoc';
import {cap} from 'enact-core/util';

const defaultConfig = {
	toggle: 'onClick',
	prop: 'selected'
};

const ToggleableHoC = hoc(defaultConfig, (config, Wrapped) => {
	return class Toggleable extends React.Component {
		static propTypes = {
			defaultSelected: React.PropTypes.bool,
			disabled: React.PropTypes.bool
		}

		static defaultProps = {
			defaultSelected: false
		}

		constructor (props) {
			super(props);
			this.state = {
				selected: props['default' + cap(config.prop)]
			};
		}

		onToggle = () => {
			if (!this.props.disabled) {
				this.setState({selected: !this.state.selected});
			}
		}

		render () {
			const props = R.dissoc('defaultSelected', this.props);
			props[config.toggle] = this.onToggle;
			props[config.prop] = this.state.selected;

			return <Wrapped {...props} />;
		}
	};
});

export default ToggleableHoC;
export {ToggleableHoC as Toggleable};
