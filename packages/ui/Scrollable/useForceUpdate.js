import {useReducer} from 'react';

const useForceUpdate = () => {
	return useReducer(x => x + 1, 0);
};

export default useForceUpdate;
