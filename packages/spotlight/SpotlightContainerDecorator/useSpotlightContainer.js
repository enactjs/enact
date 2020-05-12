import useClass from '@enact/core/useClass';
import React from 'react';

import Spotlight from '../src/spotlight';

import SpotlightContainer from './SpotlightContainer';

const stateFromProps = ({preserveId, spotlightId, spotlightRestrict}) => {
	const options = {restrict: spotlightRestrict};
	const id = Spotlight.add(spotlightId || options, options);
	return {
		id,
		preserveId: preserveId && id === spotlightId,
		spotlightRestrict
	};
};

/**
 * Configuration for `useSpotlightContainer`
 *
 * @typedef {Object} useSpotlightContainerConfig
 * @memberof spotlight/SpotlightContainerDecorator
 * @property {Object}   [containerConfig]   Spotlight container configuratiohn.
 * @property {Function} [navigableFilter]   Make a decision if a spottable component is accessibilt.
 * @property {Boolean}  [preserveId]        Whether the container will preserve the id when it unmounts.
 * @property {Boolean}  [spotlightDisabled] When `true`, controls in the container cannot be navigated.
 * @property {String}   [spotlightId]       Used to identify this component within the Spotlight system.
 *                                          If the value is `null`, an id will be generated.
 * @property {Function} [spotlightRestrict] Restricts or prioritizes navigation when focus attempts to leave the container. It
 *                                          can be either 'none', 'self-first', or 'self-only'. Specifying 'self-first' indicates that
 *                                          elements within the container will have a higher likelihood to be chosen as the next
 *                                          navigable element. Specifying 'self-only' indicates that elements in other containers
 *                                          cannot be navigated to by using 5-way navigation - however, elements in other containers
 *                                          can still receive focus by calling `Spotlight.focus(elem)` explicitly. Specying 'none'
 *                                          indicates there should be no restrictions when 5-way navigating the container.
 * @private
 */

/**
 * Object returned by `useSpotlightContainer`
 *
 * @typedef {Object} useSpotlightContainerInterface
 * @property {Function} blur            CSS classes that should be applied to the root node
 * @property {Function} focus           Indicates if resources have been loaded
 * @property {String}   id              Current locale
 * @property {Function} mouseEnter      Indicates the current locale uses right-to-left text direction
 * @property {Function} mouseLeave      Indicates the current locale uses right-to-left text direction
 * @property {Function} navigableFilter Indicates the current locale uses right-to-left text direction
 * @property {Function}
 */

/**
 * Support Spotlight container
 *
 * @param {useSpotlightContainerConfig} config Configuration options
 * @returns {useSpotlightContainerInterface}
 * @private
 */
function useSpotlightContainer (config) {
	const {preserveId} = config;
	const state = React.useRef(stateFromProps(config, preserveId));
	const spotlightContainer = useClass(SpotlightContainer, {state, ...config});

	spotlightContainer.setPropsAndContext(config, {preserveId, state, stateFromProps});

	React.useEffect(() => {
		return () => {
			spotlightContainer.unload();
		};
	});

	return {
		blur: spotlightContainer.handleBlur,
		focus: spotlightContainer.handleFocus,
		id: state.current.id,
		mouseEnter: spotlightContainer.handleMouseEnter,
		mouseLeave: spotlightContainer.handleMouseLeave,
		navigableFilter: spotlightContainer.navigableFilter
	};
}

export default useSpotlightContainer;
export {
	useSpotlightContainer
};
