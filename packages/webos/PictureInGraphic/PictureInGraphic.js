import LS2Request from '@enact/webos/LS2Request';
import {platform} from '@enact/webos/platform';

export const launchApp = (id, {onSuccess, onFailure} = {}) => {
	if (platform.tv) {
		new LS2Request().send(
			{
				service: 'luna://com.webos.applicationManager',
				method: 'launch',
				parameters: {id},
				onSuccess,
				onFailure
			}
		);
	}
};

let req = null;
export const subscribeVideoState  = (mediaId, sourceType, {onSuccess, onFailure} = {}) => {
	if (platform.tv) {
		if (req && req instanceof LS2Request) {
			req.cancel();
			req = null;
		}
		req = new LS2Request();
		if (sourceType === 'broadcast') {
			req.send({
				service: 'luna://com.webos.service.utp.broadcast/',
				method: 'getChannelState',
				parameters: {'broadcastId' : mediaId},
				subscribe: true,
				onSuccess,
				onFailure
			});
		} else {
			req.send({
				service: 'luna://com.webos.service.tv.externaldevice/input',
				method: 'getSignalState',
				parameters: {'externalInputId' : mediaId},
				subscribe: true,
				onSuccess,
				onFailure
			});
		}
		return req;
	}
};

export const unsubscribeVideoState = () => {
	if (platform.tv && req && req instanceof LS2Request) {
		req.cancel();
		req = null;
	}
};
