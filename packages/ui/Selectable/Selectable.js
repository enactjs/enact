/**
 * Exports the {@link module:@enact/ui/Selectable~Selectable} Higher-order Component (HOC).
 *
 * @module @enact/ui/Selectable
 */

import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {cap} from '@enact/core/util';
import React from 'react';

const defaultConfig = {
	/**
	 * If a Selectable component is used to maintain uncommitted state within another component,
	 * `mutable` allows `prop` to be updated via incoming props in addition to the `select` callback.
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
	 * Configures the prop name to pass the callback to select a value
	 *
	 * @type {String}
	 * @default 'onSelect'
	 */
	select: 'onSelect',

	/**
	 * Configures the prop name to pass the current value
	 *
	 * @type {String}
	 * @default 'selected'
	 */
	prop: 'selected'
};

/**
 * {@link module:@enact/ui/Selectable~Selectable} is a Higher-order Component that applies a 'Selectable' behavior
 * to its wrapped component.  Its default event and value properties can be configured when applied to a component.
 * In addition, it supports `mutable` config setting that allows the HOC to accept incoming settings for the `prop`.
 *
 * By default, you can set the initial state of the Selectable item by passing `defaultValue`.  Once rendered, the
 * HOC manages the state of `value`.  If the `prop` is overridden, the names change correspondingly.
 *
 * @class Selectable
 * @ui
 * @public
 */
const Selectable = hoc(defaultConfig, (config, Wrapped) => {
	const {mutable, prop, select} = config;
	const defaultPropKey = 'default' + cap(prop);
	const forwardSelect = forward(select);

	return class extends React.Component {
		static displayName = 'Selectable'

		static propTypes = {
			/**
			 * Controls whether the component is disabled.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			disabled: React.PropTypes.bool
		}

		constructor (props) {
			super(props);
			const key = (mutable && prop in props) ? prop : defaultPropKey;
			const selected = props[key];
			this.state = {selected};
		}

		componentWillReceiveProps (nextProps) {
			if (mutable) {
				const selected = nextProps[prop];
				this.setState({selected});
			}
		}

		handleSelect = (ev) => {
			if (!this.props.disabled) {
				const selected = ev[prop];
				this.setState({selected});
				forwardSelect(ev, this.props);
			}
		}

		render () {
			const props = Object.assign({}, this.props);
			if (select) props[select] = this.handleSelect;
			if (prop) props[prop] = this.state.selected;
			delete props[defaultPropKey];

			return <Wrapped {...props} />;
		}
	};
});

export default Selectable;
export {Selectable};
