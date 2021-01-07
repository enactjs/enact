import useClass from '@enact/core/useClass';
import {useState, useEffect} from 'react';

import {States} from './state';
import Touch from './Touch';

function useTouch (config = {}) {
	const {
		getActive = false, disabled,
		dragConfig, flickConfig, holdConfig,
		onDrag, onDragEnd, onDragStart, onHold, onHoldEnd, onHoldPulse, onFlick
	} = config;

	const touch = useClass(Touch);
	const [state, setState] = useState(States.Inactive);

	touch.setPropsAndContext({...config, disabled: !!disabled}, state, setState);

	// componentDidMount and componentWillUnmount
	useEffect(() => {
		touch.addGlobalHandlers();
		return (() => {
			touch.disable();
			touch.removeGlobalHandlers();
		});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		touch.updateGestureConfig(dragConfig, flickConfig, holdConfig);
	}, [dragConfig, flickConfig, holdConfig]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		touch.updateProps(config);
	}, [onDrag, onDragEnd, onDragStart, onHold, onHoldEnd, onHoldPulse, onFlick]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (disabled) {
			touch.disable();
		}
	}, [disabled]); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		setState((prevState) => ((!getActive || disabled) ? States.Inactive : prevState));
	}, [getActive, disabled]);

	return {
		active: state !== States.Inactive,
		handlers: touch.getHandlers()
	};
}

export default useTouch;
export {
	useTouch
};
