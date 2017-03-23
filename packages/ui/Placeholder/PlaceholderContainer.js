/**
 * Exports the {@link ui/PlaceholderContainer.PlaceholderContainer} Higher-order Component (HOC).
 *
 * @module ui/PlaceholderContainer
 */

import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import React from 'react';

import {contextTypes} from './PlaceholderDecorator';

const forwardScroll = forward('onScroll');

/**
 * {@link ui/PlaceholderContainer.PlaceholderContainer} is a Higher-order Component that can ...
 *
 * ...
 *
 * @class PlaceholderContainer
 * @memberof ui/PlaceholderContainer
 * @hoc
 * @public
 */
const PlaceholderContainer = hoc((config, Wrapped) => {
	return class extends React.Component {
		static displayName = 'PlaceholderContainer'
		static childContextTypes = contextTypes

		constructor (props) {
			super(props);

			this.setOffsetTopThreshold(0);
		}

		getChildContext () {
			return {
				getPlaceholderOffsetTopThreshold: this.getOffsetTopThreshold,
				registerPlaceholder: this.handleRegister,
				unregisterPlaceholder: this.handleUnregister
			};
		}

		controlled = []
		offsetTopThreshold = 0

		handleRegister = (observer) => {
			this.controlled.push(observer);
		}

		handleUnregister = ({index, observer}) => {
			if (typeof index === 'number') {
				this.controlled.splice(index, 1);
			} else {
				for (let i in this.controlled) {
					if (this.controlled[i] === observer) {
						this.controlled.splice(i, 1);
					}
				}
			}
		}

		notifyAll (offsetTopThreshold, length) {
			if (length > 0) {
				for (let i = length - 1; i >= 0; i--) {
					this.controlled[i].update({
						offsetTopThreshold,
						index: i
					});
				}
			}
		}

		getOffsetTopThreshold = () => this.offsetTopThreshold

		setOffsetTopThreshold (scrollTop) {
			const
				{clientHeight} = this.props,
				offsetTopThreshold = (Math.floor(scrollTop / clientHeight) + 2) * clientHeight;

			if (this.offsetTopThreshold < offsetTopThreshold) {
				const length = this.controlled.length;

				if (this.controlled.length > 0) {
					this.notifyAll(offsetTopThreshold, length);
				}
				this.offsetTopThreshold = offsetTopThreshold;
			}
		}

		onScroll = (param) => {
			const {scrollTop} = param;

			this.setOffsetTopThreshold(scrollTop);
			forwardScroll(param, this.props);
		}

		render () {
			const props = Object.assign({}, this.props);

			delete props.clientHeight;

			return (<Wrapped {...props} onScroll={this.onScroll} />);
		}
	};
});

export default PlaceholderContainer;
