import hoc from '@enact/core/hoc';
import React, {Component} from 'react';

/**
 * Default config for {@link moonstone/LazyDecorator.LazyDecorator}
 *
 * @memberof moonstone/LazyDecorator.LazyDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Configures the number of the children rendered when mounting
	 *
	 * @type {Number}
	 * @default 5
	 * @memberof moonstone/LazyDecorator.LazyDecorator.defaultConfig
	 */
	initialNumOfChildren: 5
};

/**
 * {@link moonstone/LazyDecorator.LazyDecorator} is a Higher-order Component for its wrapped component
 * to render few children first and to render the other children later.Its default event and property can be
 * configured when applied to a component.
 *
 * By default, the only 5 children of the its wrapped component are rendered.
 *
 * @class LazyDecorator
 * @memberof moonstone/LazyDecorator
 * @hoc
 * @public
 */
const LazyDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const initialNumOfChildren = config.initialNumOfChildren;

	return class Lazy extends Component {
		constructor (props) {
			super(props);

			this.state = {
				didMount: false
			};
		}
		componentDidMount () {
			// eslint-disable-next-line react/no-did-mount-set-state
			this.setState({didMount: true});
		}
		render () {
			const props = Object.assign({}, this.props);

			if (!this.state.didMount) {
				props.children = props.children.slice(0, initialNumOfChildren);
			}

			return <Wrapped {...props} />;
		}
	};
});

export default LazyDecorator;
