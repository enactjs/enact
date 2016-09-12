import R from 'ramda';
import React from 'react';
import hoc from 'enact-core/hoc';
import {cap} from 'enact-core/util';

const defaultConfig = {
	pick: 'onChange',
	prop: 'value'
};

const PickableHoC = hoc(defaultConfig, (config, Wrapped) => {
	const defaultPropKey = 'default' + cap(config.prop);

	return class Pickable extends React.Component {
		static propTypes = {
			disabled: React.PropTypes.bool,
			value: React.PropTypes.number
		}

		static defaultProps = {
			value: 0
		}

		constructor (props) {
			super(props);
			this.state = {
				value: props[defaultPropKey]
			};
		}

		pick = (ev) => {
			this.setState({value: ev[config.prop]});
			const onPick = this.props[config.pick];
			if (onPick) onPick(ev);
		}

		render () {
			const props = R.dissoc(defaultPropKey, this.props);
			props[config.pick] = this.pick;
			props[config.prop] = this.state.value;

			return <Wrapped {...props} />;
		}
	};
});

export default PickableHoC;
export {PickableHoC as Pickable};
