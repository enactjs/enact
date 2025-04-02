import {useState, useCallback, use, useEffect} from 'react';

import {FloatingLayerContext} from './FloatingLayerDecorator';

function useFloatingLayer () {
	const [floatingLayerId, setId] = useState(null);
	const handler = useCallback((ev) => {
		if (ev.action === 'mount' && ev.floatingLayer) {
			setId(ev.floatingLayer.id);
		}
	}, [setId]);

	const registerFloatingLayer = use(FloatingLayerContext);

	useEffect(() => {
		if (registerFloatingLayer) {
			registerFloatingLayer(handler);
		}
	}, [handler, registerFloatingLayer]);

	return {floatingLayerId};
}

export default useFloatingLayer;
export {useFloatingLayer};
