import React from 'react';

import {FloatingLayerContext} from './FloatingLayerDecorator';

function useFloatingLayer () {
	const [floatingLayerId, setId] = React.useState(null);
	const handler = React.useCallback((ev) => {
		if (ev.action === 'mount' && ev.floatingLayer) {
			setId(ev.floatingLayer.id);
		}
	}, [setId]);

	const registerFloatingLayer = React.useContext(FloatingLayerContext);
	if (registerFloatingLayer) {
		registerFloatingLayer(handler);
	}

	return {floatingLayerId};
}

export default useFloatingLayer;
export {useFloatingLayer};
