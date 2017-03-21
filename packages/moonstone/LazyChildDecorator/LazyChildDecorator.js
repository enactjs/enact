/**
 * Exports the {@link moonstone/LazyChildDecorator.LazyChildDecorator} Higher-order Component (HOC).
 *
 * @module moonstone/LazyChildDecorator
 */

import hoc from '@enact/core/hoc';
import React from 'react';
import VisibilityObserver from '@enact/ui/VisibilityObserver';

const defaultConfig = {
	initialHeight: 0
};

const contextTypes = {
	getScrollTop: React.PropTypes.func
};

let num = 0;

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

			this.id = num++;
		}

		static contextTypes = contextTypes

		componentWillLoad () {
			this.setState({visible: true});
		}

		componentDidMount () {
			const
				self = this,
				elm = document.querySelectorAll('div[data-lazy-index]')[this.id];

			new VisibilityObserver(elm, function() {
				self.componentWillLoad();
			});
		}

		render () {
			const
				props = Object.assign({}, this.props),
				{visible} = this.state;

			if (visible) {
				return (
					<Wrapped {...props} data-lazy-index={this.id} key={props.index} />
				);
			} else {
				return (
					<div data-lazy-index={this.id} key={props.index} style={{height: initialHeight + 'px'}} />
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
