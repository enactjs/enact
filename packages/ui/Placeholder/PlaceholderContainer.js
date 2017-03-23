/**
 * Exports the {@link ui/PlaceholderContainer.PlaceholderContainer} Higher-order Component (HOC).
 *
 * @module ui/PlaceholderContainer
 */

import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import React, {Component} from 'react';

import {contextTypes} from './PlaceholderDecorator';

/**
 * Default config for {@link ui/PlaceholderDecorator.PlaceholderDecorator}
 *
 * @memberof ui/PlaceholderDecorator.PlaceholderDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * The client height of the placeholder container.
	 *
	 * @type {Number}
	 * @default 0
	 * @public
	 */
	clientHeight: 0
};

const forwardScroll = forward('onScroll');

/**
 * {@link ui/PlaceholderContainer.PlaceholderContainer} is a Higher-order Component that can make
 * placeholders rendered or not rendered depending on `'scrollTop'` from the `'onScroll'`'s parameter.
 *
 * @class PlaceholderContainer
 * @memberof ui/PlaceholderContainer
 * @hoc
 * @public
 */
const PlaceholderContainer = hoc(defaultConfig, (config, Wrapped) => {
	const clientHeight = config.clientHeight;

	return class extends Component {
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

		handleRegister = (key, callback) => {
			this.controlled.push({callback, key});
		}

		handleUnregister = ({index, key}) => {
			if (typeof index === 'number') {
				this.controlled.splice(index, 1);
			} else {
				const length = this.controlled.length;

				for (let i = 0; i < length; i++) {
					if (this.controlled[i].key === key) {
						this.controlled.splice(i, 1);
					}
				}
			}
		}

		notifyAll (offsetTopThreshold, length) {
			if (length > 0) {
				for (let i = length - 1; i >= 0; i--) {
					const {callback} = this.controlled[i];

					callback({
						offsetTopThreshold,
						index: i
					});
				}
			}
		}

		getOffsetTopThreshold = () => this.offsetTopThreshold

		setOffsetTopThreshold (scrollTop) {
			const offsetTopThreshold = (Math.floor(scrollTop / clientHeight) + 2) * clientHeight;

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
			return (<Wrapped {...this.props} onScroll={this.onScroll} />);
		}
	};
});

export default PlaceholderContainer;
