import useClass from '@enact/core/useClass';
import React from 'react';

import SpotlightContainer from './SpotlightContainer';

function useSpotlightContainer (config) {
	const spotlightContainer = useClass(SpotlightContainer, config);

	spotlightContainer.setPropsAndContext(config);

	React.useEffect(() => {
		return () => {
			spotlightContainer.componentWillUnmount();
		};
	});

	return {
		navigableFilter: spotlightContainer.navigableFilter,
		id: spotlightContainer.state.id,
		blur: spotlightContainer.handleBlur,
		focus: spotlightContainer.handleFocus,
		mouseEnter: spotlightContainer.handleMouseEnter,
		mouseLeave: spotlightContainer.handleMouseLeave
	};
}

export default useSpotlightContainer;
export {
	useSpotlightContainer
};
