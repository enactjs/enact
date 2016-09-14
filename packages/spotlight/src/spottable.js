import React from 'react';
import hoc from './hoc';

const spottableClass = 'spottable';
const decoratedProp = 'data-spot-decorated';

const defaultConfig = {};

const Spottable = hoc(defaultConfig, (config, Wrapped) => {
	return class extends React.Component {
		static propTypes = {
			decorated: React.PropTypes.bool,
			disabled: React.PropTypes.bool,
			spotlightDisabled: React.PropTypes.bool
		}

		render () {
			const props = Object.assign({}, this.props, {useEnterKey: true});
			props[decoratedProp] = props.decorated;
			delete props.decorated;

			if (!this.props.disabled && !this.props.spotlightDisabled) {
				props.tabIndex = -1;
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
export {Spottable, spottableClass, decoratedProp};
