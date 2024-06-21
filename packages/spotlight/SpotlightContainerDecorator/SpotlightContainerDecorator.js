/**
 * A component for managing groups of spottable components.
 *
 * @module spotlight/SpotlightContainerDecorator
 * @exports SpotlightContainerDecorator
 */

import handle, {forward} from '@enact/core/handle';
import useHandlers from '@enact/core/useHandlers';
import hoc from '@enact/core/hoc';
import {Component} from 'react';
import PropTypes from 'prop-types';

import useSpotlightContainer from './useSpotlightContainer';

const callContext = (name) => (ev, props, context) => context[name](ev, props);
const containerHandlers = {
	onMouseEnter: handle(
		forward('onMouseEnter'),
		callContext('onPointerEnter')
	),
	onMouseLeave: handle(
		forward('onMouseLeave'),
		callContext('onPointerLeave')
	),
	onFocusCapture: handle(
		callContext('onFocusCapture'),
		forward('onFocusCapture')
	),
	onBlurCapture: handle(
		callContext('onBlurCapture'),
		forward('onBlurCapture')
	)
};

/**
 * The class name to apply to the default component to focus in a container.
 *
 * @memberof spotlight/SpotlightContainerDecorator
 * @public
 */
const spotlightDefaultClass = 'spottable-default';

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
	 * When an array of selectors is provided, the first selector that successfully matches a
	 * node is used.
	 *
	 * @type {String|String[]}
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
	 * Directs which element receives focus when the focus is leaving from the current container using 5-way direction keys.
	 * If `{down: '#left'}`, the focus moves to the DOM element whose id value is `left` when pressing the 5-way down.
	 * If `{left: '', right: ''}`, the focus cannot leave the current container with 5-way left and right.
	 * If `null`, the default 5-way behavior will be applied.
	 *
	 * @type {Object}
	 * @default null
	 * @memberof spotlight/SpotlightContainerDecorator.SpotlightContainerDecorator.defaultConfig
	 * @public
	 */
	leaveFor: null,

	/**
	 * Filter the navigable elements.
	 *
	 * @type {Function}
	 * @memberof spotlight/SpotlightContainerDecorator.SpotlightContainerDecorator.defaultConfig
	 * @public
	 */
	navigableFilter: null,

	/**
	 * Whether the container will preserve the specified `spotlightId` when it unmounts.
	 *
	 * @type {Boolean}
	 * @default false
	 * @memberof spotlight/SpotlightContainerDecorator.SpotlightContainerDecorator.defaultConfig
	 * @public
	 */
	preserveId: false,

	/**
	 * Restricts or prioritizes navigation when focus attempts to leave the container. It
	 * can be either 'none', 'self-first', or 'self-only'. Specifying 'self-first' indicates that
	 * elements within the container will have a higher likelihood to be chosen as the next
	 * navigable element. Specifying 'self-only' indicates that elements in other containers
	 * cannot be navigated to by using 5-way navigation - however, elements in other containers
	 * can still receive focus by calling `Spotlight.focus(elem)` explicitly. Specifying 'none'
	 * indicates there should be no restrictions when 5-way navigating the container.
	 *
	 * @type {String}
	 * @default 'self-first'
	 * @memberof spotlight/SpotlightContainerDecorator.SpotlightContainerDecorator.defaultConfig
	 * @public
	 */
	restrict: PropTypes.oneOf(['none', 'self-first', 'self-only'])
};

/**
 * Constructs a higher-order component that allows Spotlight focus to be passed to its own
 * configurable hierarchy of spottable child controls.
 *
 * Note: This HoC passes a number of props to the wrapped component that should be passed to the
 * main DOM node.
 *
 * Example:
 * ```
 *	const Component = ({myProp, ...rest}) => (
 *		<div {...rest}>{myProp}</div>
 *	);
 *	...
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

	// eslint-disable-next-line no-shadow
	function SpotlightContainerDecorator (props) {
		const {spotlightDisabled = false, spotlightId, spotlightMuted = false, spotlightRestrict = 'self-first', ...rest} = props;

		const spotlightContainer = useSpotlightContainer({
			id: spotlightId,
			muted: spotlightMuted,
			disabled: spotlightDisabled,
			restrict: spotlightRestrict,

			containerConfig, // continue5WayHold, defaultElement, and enterTo can be in the containerConfig object.
			navigableFilter,
			preserveId
		});
		const handlers = useHandlers(containerHandlers, props, spotlightContainer);

		return (
			<Wrapped {...rest} {...spotlightContainer.attributes} {...handlers} />
		);
	}

	SpotlightContainerDecorator.propTypes = /** @lends spotlight/SpotlightContainerDecorator.SpotlightContainerDecorator.prototype */ {
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
		 * To keep the container information for restoring focus, it is required to specify
		 * a unique identifier.
		 *
		 * @type {String}
		 * @public
		 */
		spotlightId: PropTypes.string,

		/**
		 * Whether or not the container is in muted mode.
		 *
		 * In muted mode, `:focus` CSS styles will not be applied to the
		 * Spottable controls giving them the appearance of not having focus
		 * while they still have focus.
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
		 * can still receive focus by calling `Spotlight.focus(elem)` explicitly. Specifying 'none'
		 * indicates there should be no restrictions when 5-way navigating the container.
		 *
		 * @type {String}
		 * @default 'self-first'
		 * @public
		 */
		spotlightRestrict: PropTypes.oneOf(['none', 'self-first', 'self-only'])
	};

	// Wrapping with a React.Component to maintain ref support
	return class SpotlightContainerDecoratorAdapter extends Component {
		render () {
			return (
				<SpotlightContainerDecorator {...this.props} />
			);
		}
	};
});

export default SpotlightContainerDecorator;
export {
	SpotlightContainerDecorator,
	spotlightDefaultClass,
	useSpotlightContainer
};
