import hoc from '@enact/core/hoc';
import React, {Component} from 'react';

/**
 * Default config for {@link moonstone/LazyChildrenDecorator.LazyChildrenDecorator}
 *
 * @memberof moonstone/LazyChildrenDecorator.LazyChildrenDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Configures the number of the children rendered when mounting
	 *
	 * @type {Number}
	 * @default 5
	 * @memberof moonstone/LazyChildrenDecorator.LazyChildrenDecorator.defaultConfig
	 */
	initialNumOfChildren: 5
};

/**
 * The context propTypes required by `Resizable`. This should be set as the `childContextTypes` of a
 * container that needs to be notified of a resize.
 *
 * @type {Object}
 * @memberof ui/Resizable
 * @public
 */
const contextTypes = {
	invalidateBounds: React.PropTypes.func
};

/**
 * {@link moonstone/LazyChildrenDecorator.LazyChildrenDecorator} is a Higher-order Component so that its few wrapped children
 * are rendered first and the other wrapped children are rendered later. The number of the former children
 * can be configured when applied to a component.
 *
 * By default, the only 5 wrapped children are rendered first.
 *
 * @class LazyChildrenDecorator
 * @memberof moonstone/LazyChildrenDecorator
 * @hoc
 * @public
 */
const LazyChildrenDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const initialNumOfChildren = config.initialNumOfChildren;

	return class Lazy extends Component {
		static contextTypes = contextTypes

		constructor (props) {
			super(props);

			this.state = {
				didMount: false
			};
		}

		invalidateBounds = () => this.context.invalidateBounds()

		componentDidMount () {
			if (this.state.didMount === false) {
				window.setTimeout(() => {
					// eslint-disable-next-line react/no-did-mount-set-state
					this.setState({didMount: true});
					if (this.invalidateBounds) {
						this.invalidateBounds();
					}
				}, 1);
			}
		}

		render () {
			let props = this.props;

			if (!this.state.didMount) {
				if (props.children.length <= initialNumOfChildren) {
					window.setTimeout(() => {
						// eslint-disable-next-line react/no-direct-mutation-state
						this.state.didMount = true;
					}, 1);
				} else {
					props = Object.assign({}, this.props);
					props.children = props.children.slice(0, initialNumOfChildren);
				}
			}

			return <Wrapped {...props} />;
		}
	};
});

export default LazyChildrenDecorator;
