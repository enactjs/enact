import React from 'react';
import hoc from 'enact-core/hoc';
import {cap} from 'enact-core/util';

const defaultConfig = {
	/**
	 * If a Pickable component is used to maintain uncommitted state within another component,
	 * `mutable` allows `prop` to be updated via incoming props in addition to the `pick` callback.
	 * When `true` and `prop` is specified, it will take precendence over the default value.
	 *
	 * When using this property, it may be necessary to prevent unnecessary updates using
	 * `shouldComponentUpdate()` to avoid resetting the value inadvertently.
	 *
	 * @type {Boolean}
	 * @default false
	 */
	mutable: false,

	/**
	 * Configures the prop name to pass the callback to update the value
	 *
	 * @type {String}
	 * @default 'onChange'
	 */
	pick: 'onChange',

	/**
	 * Configures the prop name to pass the current value
	 *
	 * @type {String}
	 * @default 'value'
	 */
	prop: 'value'
};

const PickableHoC = hoc(defaultConfig, (config, Wrapped) => {
	const {mutable, prop} = config;
	const defaultPropKey = 'default' + cap(prop);

	return class Pickable extends React.Component {
		static propTypes = {
			[defaultPropKey]: React.PropTypes.number,
			disabled: React.PropTypes.bool
		}

		static defaultProps = {
			[defaultPropKey]: 0
		}

		constructor (props) {
			super(props);
			const key = (mutable && prop in props) ? prop : defaultPropKey;
			const value = props[key];
			this.state = {value};
		}

		componentWillReceiveProps (nextProps) {
			if (mutable) {
				const value = nextProps[prop];
				this.setState({value});
			}
		}

		pick = (ev) => {
			const value = ev[config.prop];
			const onPick = this.props[config.pick];

			this.setState({value});
			if (onPick) onPick(ev);
		}

		render () {
			const props = Object.assign({}, this.props);
			props[config.pick] = this.pick;
			props[config.prop] = this.state.value;
			delete props[defaultPropKey];

			return <Wrapped {...props} />;
		}
	};
});

export default PickableHoC;
export {PickableHoC as Pickable};
