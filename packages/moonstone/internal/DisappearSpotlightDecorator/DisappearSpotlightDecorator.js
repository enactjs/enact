/**
 * Exports the {@link moonstone/internal/DisappearSpotlightDecorator.DisappearSpotlightDecorator}
 * Higher-order Component (HOC).
 *
 * @module moonstone/internal/DisappearSpotlightDecorator
 * @private
 */

import {forward, handle} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import invariant from 'invariant';
import React from 'react';
import ReactDOM from 'react-dom';
import Spotlight from '@enact/spotlight';


/**
 * Default config for
 * {@link moonstone/internal/DisappearSpotlightDecorator.DisappearSpotlightDecorator}.
 *
 * @memberof moonstone/internal/DisappearSpotlightDecorator.DisappearSpotlightDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Maps event callback names (e.g. `onButtonSpotlightDisapper`) to a selector used to find the
	 * next focus target when that callback is fired.
	 *
	 * @type {Object}
	 * @memberof moonstone/internal/DisappearSpotlightDecorator.DisappearSpotlightDecorator.defaultConfig
	 * @private
	 */
	events: null
};


/**
 * {@link moonstone/internal/DisappearSpotlightDecorator.DisappearSpotlightDecorator} is a
 * Higher-order Component that supports automatically moving focus between components when one is
 * disabled or unmounted.
 *
 * It is configured with a map of event names to CSS selectors. When the event callback is invoked,
 * it will attempt to focus the first element within the Wrapped component that matches the
 * selector.
 *
 * ```
 * const MyComponent = DisappearSpotlightComponent(
 * 	{events: {
 * 		// when the button is disabled, spot the item
 * 		onButtonSpotlightDisappear: '.item',
 * 		// when the item is disabled, spot the button
 * 		onItemSpotlightDisappear: '.button',
 * 	}}
 * )
 * ```
 *
 * @class DisappearSpotlightDecorator
 * @memberof moonstone/internal/DisappearSpotlightDecorator
 * @hoc
 * @private
 */
const DisappearSpotlightDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {events} = config;

	invariant(
		events,
		'The config property, events, is required for DisappearSpotlightDecorator'
	);

	return class extends React.Component {
		static displayName = 'DisappearSpotlightDecorator'

		constructor () {
			super();

			this.handlers = {};
			Object.keys(events).forEach((key) => {
				this.handlers[key] = this.handleDisappear(events[key]);
			});
		}

		componentDidMount () {
			// eslint-disable-next-line react/no-find-dom-node
			this.node = ReactDOM.findDOMNode(this);
		}

		handle = handle.bind(this)

		handleDisappear = (selector) => this.handle(
			() => {
				if (this.node && !Spotlight.getPointerMode()) {
					// stop chain if focus succeeds
					return !Spotlight.focus(this.node.querySelector(selector));
				}

				return true;
			},
			forward('onSpotlightDisappear')
		)

		render () {
			return (
				<Wrapped {...this.props} {...this.handlers} />
			);
		}
	};
});

export default DisappearSpotlightDecorator;
export {
	DisappearSpotlightDecorator
};
