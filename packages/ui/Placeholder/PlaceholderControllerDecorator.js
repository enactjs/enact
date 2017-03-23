/**
 * Exports the {@link ui/Placeholder.PlaceholderControllerDecorator} Higher-order Component (HOC).
 *
 * @module ui/Placeholder.PlaceholderControllerDecorator
 */

import {forward, handle} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {Job} from '@enact/core/util';
import React from 'react';
import ReactDOM from 'react-dom';

import {contextTypes} from './PlaceholderDecorator';

/**
 * Default config for {@link ui/Placeholder.PlaceholderDecorator}
 *
 * @memberof ui/Placeholder.PlaceholderDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * The client height of the placeholder container.
	 *
	 * @type {Number}
	 * @public
	 */
	clientHeight: null,

	notify: 'onScroll'
};

/**
 * {@link ui/Placeholder.PlaceholderControllerDecorator} is a Higher-order Component that can make
 * placeholders rendered or not rendered depending on `'scrollTop'` from the `'onScroll'`'s parameter.
 *
 * @class PlaceholderControllerDecorator
 * @memberof ui/Placeholder
 * @hoc
 * @public
 */
const PlaceholderControllerDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {clientHeight, notify} = config;

	return class extends React.Component {
		static displayName = 'PlaceholderControllerDecorator'

		static childContextTypes = contextTypes

		clientHeight = 0
		controlled = []
		node = null
		offsetTopThreshold = -1

		getChildContext () {
			return {
				registerPlaceholder: this.handleRegister,
				unregisterPlaceholder: this.handleUnregister
			};
		}

		componentDidMount () {
			this.setClientHeight();
			this.setOffsetTopThreshold(0);
		}

		setClientHeight () {
			if (typeof clientHeight === 'number') {
				this.clientHeight = clientHeight;
			} else {
				this.node = ReactDOM.findDOMNode(this);
				this.clientHeight = this.node.offsetHeight;
			}
		}

		handleRegister = (key, callback) => {
			this.controlled.push({callback, key});
			this.notifyAllJob.start(this.offsetTopThreshold);
		}

		handleUnregister = ({index, key}) => {
			if (typeof index === 'number') {
				this.controlled.splice(index, 1);
			} else {
				const length = this.controlled.length;

				for (let i = 0; i < length; i++) {
					if (this.controlled[i].key === key) {
						this.controlled.splice(i, 1);
						break;
					}
				}
			}
		}

		notifyAll = (offsetTopThreshold) => {
			for (let index = this.controlled.length - 1; index >= 0; index--) {
				const {callback} = this.controlled[index];

				callback({
					index,
					offsetTopThreshold
				});
			}
		}

		notifyAllJob = new Job(this.notifyAll, 32)

		setOffsetTopThreshold (scrollTop) {
			const offsetTopThreshold = (Math.floor(scrollTop / this.clientHeight) + 2) * this.clientHeight;
			const length = this.controlled.length;

			if (this.offsetTopThreshold < offsetTopThreshold && length > 0) {
				this.notifyAll(offsetTopThreshold);
				this.offsetTopThreshold = offsetTopThreshold;
			}
		}

		handle = handle.bind(this)

		handleNotify = this.handle(
			forward(notify),
			({scrollTop}) => {
				this.setOffsetTopThreshold(scrollTop);
			}
		)

		render () {
			const props = Object.assign({}, this.props);

			if (notify) props[notify] = this.handleNotify;

			return (
				<Wrapped {...props} />
			);
		}
	};
});

export default PlaceholderControllerDecorator;
