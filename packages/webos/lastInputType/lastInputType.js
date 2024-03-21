/**
 * Exports a method for calling `surfacemanager` service through LS2Request and returns `lastInputType`
 *
 * @module webos/lastInputType
 * @private
 */

import LS2Request from '../LS2Request';
import platform from '../platform';

const requestLastInputType = ({onSuccess, onFailure}) => {
	if (platform.tv) {
		return new LS2Request().send({
			service: 'luna://com.webos.surfacemanager',
			method: 'getLastInputType',
			subscribe: true,
			onSuccess,
			onFailure
		});
	}

	return null;
};

export default requestLastInputType;
export {
	requestLastInputType
};
