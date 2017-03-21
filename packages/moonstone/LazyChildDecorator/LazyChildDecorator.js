/**
 * Exports the {@link moonstone/LazyChildDecorator.LazyChildDecorator} Higher-order Component (HOC).
 *
 * @module moonstone/LazyChildDecorator
 */

import hoc from '@enact/core/hoc';
import React from 'react';

const defaultConfig = {
	initialHeight: 0
};

const contextTypes = {
	attachLazyChild: React.PropTypes.func,
	detachLazyChild: React.PropTypes.func
};

const LazyChildDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {initialHeight} = config;

	return class extends React.Component {
		static displayName = 'LazyChildDecorator'

		static propTypes = /** @lends ui/LazyChildDecorator.LazyChildDecorator.prototype */ {
		}

		static defaultProps = {
		}

		constructor (props) {
			super(props);

			this.state = {
				visible: false
			};
		}

		static contextTypes = contextTypes

		update ({containerBounds, containerScrollTopThreshold, index}) {
			const offsetTop = this.childRef.offsetTop;

			if (offsetTop < containerScrollTopThreshold) {
				this.setState({visible: true});
				this.context.detachLazyChild({index});
			}
		}

		componentDidMount () {
			this.context.attachLazyChild(this);
		}

		initChildRef = (ref) => {
			this.childRef = ref;
		}

		render () {
			const
				props = Object.assign({}, this.props),
				{visible} = this.state;

			if (visible) {
				return (
					<Wrapped {...props} key={props.index} ref={this.initChildRef} />
				);
			} else {
				return (
					<div key={props.index} ref={this.initChildRef} style={{height: initialHeight + 'px'}} />
				);
			}
		}
	};
});

export default LazyChildDecorator;
export {
	contextTypes,
	LazyChildDecorator
};
