import useClass from '@enact/core/useClass';
import {useState, useEffect} from 'react';

import {States} from './state';
import Touch from './Touch';

function useTouch (config = {}) {
	const {activeProp, disabled} = config;
	const touch = useClass(Touch);
	const [state, setState] = useState({
		active: States.Inactive,
		prevDisabled: disabled
	});
	const retVal = {
		handlers: touch.getHandlers()
	};

	touch.setConfig(config);
	touch.setContext(state, setState);

	// componentDidMount and componentWillUnmount
	useEffect(() => {
		touch.addGlobalHandlers();
		return (() => {
			touch.reset();
			touch.removeGlobalHandlers();
		});
	}, [touch]);

	// componentDidUpdate
	useEffect(() => {
		const {dragConfig, flickConfig, holdConfig} = config;
		touch.updateGestureConfig(dragConfig, flickConfig, holdConfig);
	}, [touch, config.dragConfig, config.flickConfig, config.holdConfig]);

	useEffect(() => {
		// getDerivedStateFromProps
		if (state.prevDisabled !== disabled) {
			// componentDidUpdate
			if (disabled) {
				touch.reset();
			}

			setState({
				active: (activeProp && disabled) ? States.Inactive : States.Active,
				prevDisabled: disabled
			});
		}
	}, [activeProp, disabled, state, touch]);

	useEffect(() => {
		if (activeProp) {
			retVal[activeProp] = state.active !== States.Inactive;
		}
	}, [activeProp, retVal, state.active]);

	return retVal;
}

export default useTouch;
export {
	useTouch
};
