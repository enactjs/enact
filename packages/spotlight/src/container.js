import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import React, {PropTypes} from 'react';

import Spotlight from './spotlight';
import {spottableClass} from './spottable';

const spotlightDefaultClass = 'spottable-default';

const enterEvent = 'onMouseEnter';
const leaveEvent = 'onMouseLeave';

const defaultConfig = {
	/**
	 * The selector for the default spottable element within the container.
	 *
	 * @type {String}
	 * @default '.spottable-default'
	 * @public
	 */
	defaultElement: `.${spotlightDefaultClass}`,

	/**
	 * Directs which component receives focus when gaining focus from another container.
	 *
	 * @type {String}
	 * @default 'last-focused'
	 * @public
	 */
	enterTo: 'last-focused',

	/**
	 * Restricts or prioritizes navigation when focus attempts to leave the container.
	 *
	 * @type {String}
	 * @default 'none'
	 * @public
	 */
	restrict: 'none'
};

/**
 * Constructs a Higher-order Component that allows Spotlight focus to be passed to
 * its own configurable hierarchy of spottable child controls.
 *
 * @example
 *	const DefaultContainer = SpotlightContainerDecorator(Component);
 *	const SelfRestrictedContainer = SpotlightContainerDecorator({restrict: 'self-only'}, Component);
 *
 * To specify a default element to spot in a container, utilize the `spotlightDefaultClass`.
 *
 * @example
 *	import {SpotlightContainerDecorator, spotlightDefaultClass} from '@enact/spotlight';
 *	const ContainerComponent = SpotlightContainerDecorator(Component);
 *	const View = kind({
 *		render: () => {
 *			<ContainerComponent>
 *				<SpottableComponent>foo</SpottableComponent>
 *				<SpottableComponent className={spotlightDefaultClass}>spot me first</SpottableComponent>
 *			</ContainerComponent>
 *		}
 *	});
 *
 * @param  {Object} defaultConfig Set of default configuration parameters
 * @param  {Function} Higher-order component
 *
 * @returns {Function} SpotlightContainerDecorator
 */
const SpotlightContainerDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const forwardMouseEnter = forward(enterEvent);
	const forwardMouseLeave = forward(leaveEvent);

	return class extends React.Component {
		static propTypes = {
			/**
			 * Whether or not the container is in muted mode.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			spotlightMuted: PropTypes.bool
		}

		constructor (props) {
			super(props);
			this.state = {
				containerId: ''
			};
		}

		navigableFilter = (elem) => {
			let containerId;
			while (elem && elem !== document && elem.nodeType === 1) {
				containerId = elem.getAttribute('data-container-id');
				if (containerId &&
						containerId !== this.state.containerId &&
						elem.getAttribute('data-container-disabled') === 'true') {

					return false;
				}
				elem = elem.parentNode;
			}
		}

		componentWillMount () {
			const containerId = Spotlight.add(),
				selector = '[data-container-id="' + containerId + '"]:not([data-container-disabled="true"]) .' + spottableClass,
				cfg = Object.assign({}, config, {selector, navigableFilter: this.navigableFilter});

			Spotlight.set(containerId, cfg);
			this.setState({containerId: containerId});
		}

		componentWillUnmount () {
			Spotlight.remove(this.state.containerId);
		}

		handleMouseEnter = (ev) => {
			Spotlight.setActiveContainer(this.state.containerId);
			forwardMouseEnter(ev, this.props);
		}

		handleMouseLeave = (ev) => {
			Spotlight.setActiveContainer(null);
			forwardMouseLeave(ev, this.props);
		}

		render () {
			const containerId = this.state.containerId;
			const {spotlightMuted, ...rest} = this.props;

			rest['data-container-id'] = containerId;
			rest[enterEvent] = this.handleMouseEnter;
			rest[leaveEvent] = this.handleMouseLeave;

			if (spotlightMuted) {
				rest['data-container-muted'] = spotlightMuted;
			}

			return <Wrapped {...rest} />;
		}
	};
});

export default SpotlightContainerDecorator;
export {SpotlightContainerDecorator, spotlightDefaultClass};
