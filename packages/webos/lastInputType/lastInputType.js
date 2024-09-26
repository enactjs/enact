/**
 * Exports a method for calling `surfacemanager` service through LS2Request and returns `lastInputType`
 *
 * @module webos/lastInputType
 * @private
 */

import LS2Request from '../LS2Request';

const requestLastInputType = ({onSuccess, onFailure}) => {
	return new LS2Request().send({
		service: 'luna://com.webos.surfacemanager',
		method: 'getLastInputType',
		subscribe: true,
		onSuccess,
		onFailure
	});
};

export default requestLastInputType;
export {
	requestLastInputType
};
