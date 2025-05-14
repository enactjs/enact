import LS2Request from '@enact/webos/LS2Request';

const TIMEOUT_DEFAULT = 3000;

const sendLS2Request = (params) => {
	if (typeof window === 'object' && !window.PalmServiceBridge) {
		console.log('LS2 request', params);
	} else {
		return new LS2Request().send(params);
	}
};

const groupBannerInfo = (assets = []) => {
	const grouped = assets.reduce((acc, asset) => {
		if (!acc[asset.sequenceId]) {
			acc[asset.sequenceId] = [];
		}
		acc[asset.sequenceId].push(asset);
		return acc;
	}, {});

	// Sort for impression tracking for companion ads
	Object.keys(grouped).forEach(sequenceId => {
		if (grouped[sequenceId].length === 2) {
			grouped[sequenceId].sort((a, b) => {
				if (a.type === 'image' && b.type === 'video') {
					return -1;
				} else if (a.type === 'video' && b.type === 'image') {
					return 1;
				}
				return 0;
			});
		}
	});

	return Object.values(grouped);
};

const requestBannerInfoWithoutContextIndex = (params, {onSuccess, onFailure, timeout}) => {
	console.log('requestBannerInfoWithoutContextIndex', params);
	sendLS2Request({
		service: 'luna://com.webos.service.admanager',
		method: 'requestBannerInfoWithoutContextIndex',
		parameters: params,
		onSuccess: (res) => {
			if (res && res.returnValue) {
				console.log('requestBannerInfoWithoutContextIndex success', res);
				if (res.assets) {
					res.assets = groupBannerInfo(res.assets);
				}
				onSuccess(res);
			} else {
				console.log('requestBannerInfoWithoutContextIndex failure', res);
				onFailure(res);
			}
		},
		onFailure: (err) => {
			console.log('requestBannerInfoWithoutContextIndex failure', err);
			onFailure(err);
		},
		timeout,
		onTimeout: onFailure
	});
};

export const requestBannerInfo = (params, timeout = TIMEOUT_DEFAULT) => {
	console.log('[A] requestBannerInfo');
	return new Promise((resolve, reject) =>
		requestBannerInfoWithoutContextIndex(params, {
			onSuccess: (res) => {
				if (res && res.returnValue) {
					console.log('[A]requestBannerInfo success', res)
					resolve(res);
				} else {
					reject(new Error(res.ErrorText));
				}
			},
			onFailure: (err) => {
				if (!err.returnValue) {
					console.log('[A]requestBannerInfo failure', err)
					reject(err);
				} else {
					reject(new Error(err.ErrorText));
				}
			},
			timeout
		})
	);
};

export const sendImpressionTracker = (params) => {
	console.log('sendImpressionTracker', params);
	return sendLS2Request({
		service: 'luna://com.webos.service.admanager',
		method: 'sendImpressionTracker',
		parameters: params,
		onSuccess: (res) => {
			if (res && res.returnValue) {
				console.log('sendImpressionTracker success', res);
			} else {
				console.log('sendImpressionTracker failure', res);
			}
		},
		onFailure: (err) => {
			console.log('sendImpressionTracker failure', err);
		}
	});
};

export const requestAssetClickInfo = (params) => {
	console.log('requestAssetClickInfo', params);
	return sendLS2Request({
		service: 'luna://com.webos.service.admanager',
		method: 'requestAssetClickInfo',
		parameters: params,
		onSuccess: (res) => {
			if (res && res.returnValue ) {
				console.log('requestAssetClickInfo success', res);
			} else {
				console.log('requestAssetClickInfo failure', res);
			}
		},
		onFailure: (err) => {
			console.log('requestAssetClickInfo failure', err);
		}
	});
};
