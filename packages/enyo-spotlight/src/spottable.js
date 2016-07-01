import React from 'react';
import hoc from './hoc';

const spottableClass = 'spottable';

const defaultConfig = {};

const Spottable = hoc(defaultConfig, (config, Wrapped) => {
	return class extends React.Component {
		static propTypes = {
			disabled: React.PropTypes.bool
		}

		render () {
			const props = Object.assign({}, this.props, {tabIndex: -1, useEnterKey: true});
			if (!this.props.disabled) {
				if (props.className) {
					props.className += ' ' + spottableClass;
				} else {
					props.className = spottableClass;
				}
			}

			return <Wrapped {...props} />;
		}
	};
});

export default Spottable;
export {Spottable, spottableClass};
