import useClass from '@enact/core/useClass';
import React from 'react';

import Spotlight from '../src/spotlight';

import SpotlightContainer from './SpotlightContainer';

const stateFromProps = ({spotlightId, spotlightRestrict}, preserveId) => {
	const options = {restrict: spotlightRestrict};
	const id = Spotlight.add(spotlightId || options, options);
	return {
		id,
		preserveId: preserveId && id === spotlightId,
		spotlightRestrict
	};
};

function useSpotlightContainer (config) {
	const state = React.useRef(stateFromProps(config, config.preserveId));
	const spotlightContainer = useClass(SpotlightContainer, {state, config});

	spotlightContainer.setPropsAndContext(config, state);

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
