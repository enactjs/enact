import useClass from '@enact/core/useClass';
import React from 'react';

import SpotlightContainer from './SpotlightContainer';

function useSpotlightContainer (config) {
	const spotlightContainer = useClass(SpotlightContainer, config);

	spotlightContainer.setPropsAndContext(config);

	React.useEffect(() => {
		return () => {
			spotlightContainer.unload();
		};
	});

	return {
		blur: spotlightContainer.handleBlur,
		focus: spotlightContainer.handleFocus,
		id: spotlightContainer.state.id,
		mouseEnter: spotlightContainer.handleMouseEnter,
		mouseLeave: spotlightContainer.handleMouseLeave,
		navigableFilter: spotlightContainer.navigableFilter
	};
}

export default useSpotlightContainer;
export {
	useSpotlightContainer
};
