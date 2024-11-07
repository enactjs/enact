import useClass from '@enact/core/useClass';
import {useLayoutEffect} from 'react';

import SpotlightContainer from './SpotlightContainer';

/**
 * Configuration for `useSpotlightContainer`
 *
 * @typedef {Object} useSpotlightContainerConfig
 * @memberof spotlight/SpotlightContainerDecorator
 * @property {Object}   [containerConfig]                   Spotlight container configuration. This
 *                                                          is a design-time configuration and only
 *                                                          applied once on first render.
 * @property {Function} [navigableFilter]                   Called to determine if a spottable
 *                                                          component is accessible. This is a
 *                                                          design-time configuration and only
 *                                                          applied once on first render.
 * @property {Boolean}  [preserveId]                        Preserves the spotlight `id`, if
 *                                                          specified, when the component unmounts.
 * @property {Boolean}  [disabled]                          Prevents controls in the container from
 *                                                          being navigable. This is a design-time
 *                                                          configuration and only applied once on
 *                                                          first render.
 * @property {Boolean}  [muted]                             Suppresses appearance of focus within
 *                                                          the container while still allowing the
 *                                                          component to gain focus. The components
 *                                                          within the container are responsible for
 *                                                          adjusting their visual appearance based
 *                                                          on the presence of the
 *                                                          `data-spotlight-container-muted`
 *                                                          attribute on an ancestor container.
 * @property {String}   [id]                                Identifies this component within the
 *                                                          Spotlight system. If unset, an id will
 *                                                          be generated.
 * @property {('self-only'|'self-first'|'none')} [restrict] Restricts or prioritizes navigation when
 *                                                          focus attempts to leave the container.
 *                                                          It can be either 'none', 'self-first',
 *                                                          or 'self-only'. Specifying 'self-first'
 *                                                          indicates that elements within the
 *                                                          container will have a higher likelihood
 *                                                          to be chosen as the next navigable
 *                                                          element. Specifying 'self-only'
 *                                                          indicates that elements in other
 *                                                          containers cannot be navigated to by
 *                                                          using 5-way navigation - however,
 *                                                          elements in other containers can still
 *                                                          receive focus by calling
 *                                                          `Spotlight.focus(elem)` explicitly.
 *                                                          Specifying 'none' indicates there should
 *                                                          be no restrictions when 5-way navigating
 *                                                          the container.
 * @private
 */

/**
 * Object returned by `useSpotlightContainer`.
 *
 * @typedef {Object} useSpotlightContainerInterface
 * @memberof spotlight/SpotlightContainerDecorator
 * @property {Function} onBlurCapture    Callback to notify hook when a node was blurred within the
 *                                       container. Must be called during the capture phase of the
 *                                       event flow.
 * @property {Function} onFocusCapture   Callback to notify hook when a node was focused within the
 *                                       container. Must be called during the capture phase of the
 *                                       event flow.
 * @property {String}   attributes       An object of DOM attributes of representing the current
 *                                       spotlight container metadata. Must be passed onto the
 *                                       container node.
 * @property {Function} onPointerEnter   Callback to notify hook when the pointer enters the
 *                                       container. Must be called during the capture phase of the
 *                                       event flow.
 * @property {Function} onPointerLeave   Callback to notify hook when the pointer leaves the
 *                                       container. Must be called during the capture phase of the
 *                                       event flow.
 * @private
 */

/**
 * Support Spotlight container
 *
 * @param {useSpotlightContainerConfig} [config] Configuration options
 * @returns {useSpotlightContainerInterface}
 * @private
 */
function useSpotlightContainer (config = {}) {
	const {disabled, id, muted, restrict, ...rest} = config;

	const spotlightContainer = useClass(SpotlightContainer, rest);
	spotlightContainer.setProps({
		disabled,
		id,
		muted,
		restrict
	});

	useLayoutEffect(() => {
		return () => {
			spotlightContainer.unload();
		};
	}, [spotlightContainer]);

	return {
		attributes: spotlightContainer.attributes,
		onBlurCapture: spotlightContainer.onBlurCapture,
		onFocusCapture: spotlightContainer.onFocusCapture,
		onPointerEnter: spotlightContainer.onPointerEnter,
		onPointerLeave: spotlightContainer.onPointerLeave
	};
}

export default useSpotlightContainer;
export {
	useSpotlightContainer
};
