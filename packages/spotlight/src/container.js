import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import React, {PropTypes} from 'react';

import Spotlight from './spotlight';
import {spottableClass} from './spottable';

const spotlightDefaultClass = 'spottable-default';

const enterEvent = 'onMouseEnter';
const leaveEvent = 'onMouseLeave';

/**
 * Default config for {@link spotlight.SpotlightContainerDecorator}
 *
 * @memberof spotlight.SpotlightContainerDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * The selector for the default spottable element within the container.
	 *
	 * @type {String}
	 * @default '.spottable-default'
	 * @memberof spotlight.SpotlightContainerDecorator.defaultConfig
	 * @public
	 */
	defaultElement: `.${spotlightDefaultClass}`,

	/**
	 * Directs which component receives focus when gaining focus from another container.
	 *
	 * @type {String}
	 * @default 'last-focused'
	 * @memberof spotlight.SpotlightContainerDecorator.defaultConfig
	 * @public
	 */
	enterTo: 'last-focused',

	/**
	 * Whether the container will preserve the id when it unmounts.
	 *
	 * @type {Boolean}
	 * @default false
	 * @memberof spotlight.SpotlightContainerDecorator.defaultConfig
	 * @public
	 */
	preserveId: false
};

/**
 * Constructs a Higher-order Component that allows Spotlight focus to be passed to
 * its own configurable hierarchy of spottable child controls.
 *
 * @example
 *	const DefaultContainer = SpotlightContainerDecorator(Component);
 *	const FocusDefaultContainer = SpotlightContainerDecorator({enterTo: 'default-element'}, Component);
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
 * @class SpotlightContainerDecorator
 * @memberof spotlight
 * @hoc
 */
const SpotlightContainerDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const forwardMouseEnter = forward(enterEvent);
	const forwardMouseLeave = forward(leaveEvent);
	const {preserveId, ...containerConfig} = config;

	return class extends React.Component {
		static displayName = 'SpotlightContainerDecorator';

		static propTypes = /** @lends spotlight.SpotlightContainerDecorator.protoype */ {
			/**
			 * Specifies the container id. If the value is `null`, an id will be generated.
			 *
			 * @type {String}
			 * @public
			 */
			containerId: PropTypes.string,

			/**
			 * When `true`, controls in the container cannot be navigated.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			spotlightDisabled: PropTypes.bool,

			/**
			 * Whether or not the container is in muted mode.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			spotlightMuted: PropTypes.bool,

			/**
			 * Restricts or prioritizes navigation when focus attempts to leave the container. It
			 * can be either 'none', 'self-first', or 'self-only'. Specifying 'self-first' indicates that
			 * elements within the container will have a higher likelihood to be chosen as the next
			 * navigable element. Specifying 'self-only' indicates that elements in other containers
			 * cannot be navigated to by using 5-way navigation - however, elements in other containers
			 * can still receive focus by calling `Spotlight.focus(elem)` explicitly. Specying 'none'
			 * indicates there should be no restrictions when 5-way navigating the container.
			 *
			 * @type {String}
			 * @default 'none'
			 * @public
			 */
			spotlightRestrict: PropTypes.oneOf(['none', 'self-first', 'self-only'])
		}

		static defaultProps = {
			spotlightDisabled: false,
			spotlightMuted: false,
			spotlightRestrict: 'none'
		}

		constructor (props) {
			super(props);
			this.state = {
				id: this.props.containerId || Spotlight.add()
			};
		}

		navigableFilter = (elem) => {
			let containerId;
			while (elem && elem !== document && elem.nodeType === 1) {
				containerId = elem.getAttribute('data-container-id');
				if (containerId &&
						containerId !== this.state.id &&
						elem.getAttribute('data-container-disabled') === 'true') {

					return false;
				}
				elem = elem.parentNode;
			}
		}

		componentWillReceiveProps (nextProps) {
			if (this.props.containerId !== nextProps.containerId) {
				Spotlight.remove(this.props.containerId);
				Spotlight.add(nextProps.containerId);
				this.setState({
					id: nextProps.containerId
				});
			}
		}

		componentDidUpdate (prevProps) {
			if (this.props.spotlightRestrict !== prevProps.spotlightRestrict) {
				Spotlight.set(this.state.id, {restrict: this.props.spotlightRestrict});
			}
		}

		componentWillMount () {
			const selector = '[data-container-id="' + this.state.id + '"]:not([data-container-disabled="true"]) .' + spottableClass,
				cfg = Object.assign({}, containerConfig, {selector, navigableFilter: this.navigableFilter, restrict: this.props.spotlightRestrict});

			Spotlight.set(this.state.id, cfg);
		}

		componentWillUnmount () {
			if (!preserveId) {
				Spotlight.remove(this.state.id);
			}
		}

		handleMouseEnter = (ev) => {
			Spotlight.setActiveContainer(this.state.id);
			forwardMouseEnter(ev, this.props);
		}

		handleMouseLeave = (ev) => {
			Spotlight.setActiveContainer(null);
			forwardMouseLeave(ev, this.props);
		}

		render () {
			const {spotlightDisabled, spotlightMuted, ...rest} = this.props;
			delete rest.containerId;
			delete rest.spotlightRestrict;

			rest['data-container-id'] = this.state.id;
			rest[enterEvent] = this.handleMouseEnter;
			rest[leaveEvent] = this.handleMouseLeave;

			if (spotlightDisabled) {
				rest['data-container-disabled'] = spotlightDisabled;
			}

			if (spotlightMuted) {
				rest['data-container-muted'] = spotlightMuted;
			}

			return <Wrapped {...rest} />;
		}
	};
});

export default SpotlightContainerDecorator;
export {SpotlightContainerDecorator, spotlightDefaultClass};
