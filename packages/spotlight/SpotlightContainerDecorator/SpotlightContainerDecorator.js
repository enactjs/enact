/**
 * Exports the {@link spotlight/SpotlightContainerDecorator.SpotlightContainerDecorator}
 * higher-order component and {@link spotlight/SpotlightContainerDecorator.spotlightDefaultClass}
 * `className`. The default export is
 * {@link spotlight/SpotlightContainerDecorator.SpotlightContainerDecorator}.
 *
 * @module spotlight/SpotlightContainerDecorator
 */

import {forProp, forward, handle, stop} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import React from 'react';
import PropTypes from 'prop-types';

import {hasPointerMoved} from '../src/pointer';
import Spotlight from '../src/spotlight';

/**
 * The class name to apply to the default component to focus in a container.
 *
 * @memberof spotlight/SpotlightContainerDecorator
 * @public
 */
const spotlightDefaultClass = 'spottable-default';

const isNewPointerPosition = (ev) => hasPointerMoved(ev.clientX, ev.clientY);
const not = (fn) => function () {
	return !fn.apply(this, arguments);
};

/**
 * Default config for {@link spotlight/SpotlightContainerDecorator.SpotlightContainerDecorator}
 *
 * @memberof spotlight/SpotlightContainerDecorator.SpotlightContainerDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * When `true`, allows focus to move outside the container to the next spottable element when
	 * holding 5 way keys.
	 *
	 * @type {Boolean}
	 * @default false
	 * @memberof spotlight/SpotlightContainerDecorator.SpotlightContainerDecorator.defaultConfig
	 * @public
	 */
	continue5WayHold: false,

	/**
	 * The selector for the default spottable element within the container.
	 *
	 * @type {String}
	 * @default '.spottable-default'
	 * @memberof spotlight/SpotlightContainerDecorator.SpotlightContainerDecorator.defaultConfig
	 * @public
	 */
	defaultElement: `.${spotlightDefaultClass}`,

	/**
	 * Directs which element receives focus when gaining focus from another container. If
	 * `'default-element'`, the default focused item will be selected. If `'last-focused'`, the
	 * container will focus the last focused item; if the container has never had focus, the default
	 * element will receive focus. If `null`, the default 5-way behavior will be applied.
	 *
	 * @type {String}
	 * @default null
	 * @memberof spotlight/SpotlightContainerDecorator.SpotlightContainerDecorator.defaultConfig
	 * @public
	 */
	enterTo: null,

	/**
	 * Whether the container will preserve the id when it unmounts.
	 *
	 * @type {Boolean}
	 * @default false
	 * @memberof spotlight/SpotlightContainerDecorator.SpotlightContainerDecorator.defaultConfig
	 * @public
	 */
	preserveId: false
};

/**
 * Constructs a higher-order component that allows Spotlight focus to be passed to
 * its own configurable hierarchy of spottable child controls.
 *
 * Example:
 * ```
 *	const DefaultContainer = SpotlightContainerDecorator(Component);
 *	const FocusDefaultContainer = SpotlightContainerDecorator({enterTo: 'default-element'}, Component);
 * ```
 *
 * To specify a default element to spot in a container, utilize the `spotlightDefaultClass`.
 *
 * Example:
 * ```
 *	import Spotlight from '@enact/spotlight';
 *	import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
 *	const ContainerComponent = SpotlightContainerDecorator(Component);
 *	const View = kind({
 *		render: () => {
 *			<ContainerComponent>
 *				<SpottableComponent>foo</SpottableComponent>
 *				<SpottableComponent className={spotlightDefaultClass}>spot me first</SpottableComponent>
 *			</ContainerComponent>
 *		}
 *	});
 * ```
 * @param  {Object}    defaultConfig  Set of default configuration parameters. Additional parameters
 *                                    are passed as configuration to {@link spotlight/Spotlight.set}
 * @param  {Function} higher-order component
 *
 * @returns {Function} SpotlightContainerDecorator
 * @class SpotlightContainerDecorator
 * @memberof spotlight/SpotlightContainerDecorator
 * @hoc
 */
const SpotlightContainerDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {navigableFilter, preserveId, ...containerConfig} = config;

	const stateFromProps = ({spotlightId, spotlightRestrict}) => {
		const options = {restrict: spotlightRestrict};
		const id = Spotlight.add(spotlightId || options, options);
		return {
			id,
			preserveId: preserveId && id === spotlightId,
			spotlightRestrict
		};
	};

	const releaseContainer = ({preserveId: preserve, id}) => {
		if (preserve) {
			Spotlight.unmount(id);
		} else {
			Spotlight.remove(id);
		}
	};

	return class extends React.Component {
		static displayName = 'SpotlightContainerDecorator';

		static propTypes = /** @lends spotlight/SpotlightContainerDecorator.SpotlightContainerDecorator.prototype */ {
			/**
			 * When `true`, controls in the container cannot be navigated.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			spotlightDisabled: PropTypes.bool,

			/**
			 * Used to identify this component within the Spotlight system.
			 *
			 * If the value is `null`, an id will be generated.
			 *
			 * @type {String}
			 * @public
			 */
			spotlightId: PropTypes.string,

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
			 * @public
			 */
			spotlightRestrict: PropTypes.oneOf(['none', 'self-first', 'self-only'])
		}

		static defaultProps = {
			spotlightDisabled: false,
			spotlightMuted: false,
			spotlightRestrict: 'self-first'
		}

		constructor (props) {
			super(props);

			this.state = stateFromProps(props);
			// Used to indicate that we want to stop propagation on blur events that occur as a
			// result of this component imperatively blurring itself on focus when spotlightDisabled
			this.shouldPreventBlur = false;

			const cfg = {
				...containerConfig,
				navigableFilter: this.navigableFilter
			};

			Spotlight.set(this.state.id, cfg);
		}

		static getDerivedStateFromProps (props, state) {
			const {spotlightId: id, spotlightRestrict} = props;
			const {id: prevId, spotlightRestrict: prevSpotlightRestrict} = state;
			// prevId will only be undefined the first render so this prevents releasing the
			// container after initially creating it
			const isIdChanged = prevId && id && prevId !== id;

			if (isIdChanged) {
				releaseContainer(state);
			}

			if (isIdChanged || spotlightRestrict !== prevSpotlightRestrict) {
				return stateFromProps({spotlightId: prevId, spotlightRestrict: prevSpotlightRestrict, ...props});
			} else {
				return null;
			}
		}

		componentWillUnmount () {
			releaseContainer(this.state);
		}

		navigableFilter = (elem) => {
			// If the component to which this was applied specified a navigableFilter, run it
			if (typeof navigableFilter === 'function') {
				if (navigableFilter(elem, this.props, this.context) === false) {
					return false;
				}
			}

			return true;
		}

		silentBlur = ({target}) => {
			this.shouldPreventBlur = true;
			target.blur();
			this.shouldPreventBlur = false;
		}

		handle = handle.bind(this)

		handleBlur = this.handle(
			() => this.shouldPreventBlur,
			stop
		)

		handleFocus = this.handle(
			forProp('spotlightDisabled', true),
			stop,
			this.silentBlur
		)

		handleMouseEnter = this.handle(
			forward('onMouseEnter'),
			isNewPointerPosition,
			() => Spotlight.setActiveContainer(this.state.id)
		)

		handleMouseLeave = this.handle(
			forward('onMouseLeave'),
			not(forProp('spotlightRestrict', 'self-only')),
			isNewPointerPosition,
			(ev) => {
				const parentContainer = ev.currentTarget.parentNode.closest('[data-spotlight-container]');
				let activeContainer = Spotlight.getActiveContainer();

				// if this container is wrapped by another and this is the currently active
				// container, move the active container to the parent
				if (parentContainer && activeContainer === this.state.id) {
					activeContainer = parentContainer.dataset.spotlightId;
					Spotlight.setActiveContainer(activeContainer);
				}
			}
		)

		render () {
			const {spotlightDisabled, spotlightMuted, ...rest} = this.props;
			delete rest.containerId;
			delete rest.spotlightId;
			delete rest.spotlightRestrict;

			rest['data-spotlight-container'] = true;
			rest['data-spotlight-id'] = this.state.id;
			rest.onBlurCapture = this.handleBlur;
			rest.onFocusCapture = this.handleFocus;
			rest.onMouseEnter = this.handleMouseEnter;
			rest.onMouseLeave = this.handleMouseLeave;

			if (spotlightDisabled) {
				rest['data-spotlight-container-disabled'] = spotlightDisabled;
			}

			if (spotlightMuted) {
				rest['data-spotlight-container-muted'] = spotlightMuted;
			}

			return (
				<Wrapped style={{'--spatial-navigation-contain': 'delegable'}} {...rest} />
			);
		}
	};
});

export default SpotlightContainerDecorator;
export {
	SpotlightContainerDecorator,
	spotlightDefaultClass
};
