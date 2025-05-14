import LS2Request from '@enact/webos/LS2Request';

const TIMEOUT_DEFAULT = 3000;
const mockBannerInfo = {
	"returnValue": true,
	"contextIndex": 46,
	"assets": [
		{
			"sponsoredText": "Sponsored",
			"contentData": "http://kic-qt-ngfts.lge.com/fts/gftsDownload.lge?biz_code=CMS&func_code=CMS_ASSET&file_path=/cms/asset/1730694969297_1.png",
			"parentId": -1,
			"duration": 0,
			"id": 1001,
			"sequenceId": 1,
			"isCached": false,
			"type": "image",
			"rotationTime": 5,
			"mime": "image/png"
		},
		{
			"sponsoredText": "Sponsored",
			"contentData": "http://kic-qt-ngfts.lge.com/fts/gftsDownload.lge?biz_code=CMS&func_code=CMS_ASSET&file_path=/cms/asset/1713143279905_1.png",
			"parentId": -1,
			"duration": 0,
			"id": 1002,
			"sequenceId": 2,
			"isCached": false,
			"type": "image",
			"rotationTime": 5,
			"mime": "image/png"
		},
		{
			"sponsoredText": "Sponsored",
			"id": 101003,
			"parentId": -1,
			"width": 1920,
			"isCached": false,
			"mime": "video/mp4",
			"sequenceId": 3,
			"height": 1080,
			"duration": 15,
			"type": "video",
			"rotationTime": 5,
			"overlayText": "Details",
			"contentData": "http://kic-qt-ngfts.lge.com/fts/gftsDownload.lge?biz_code=CMS&func_code=CMS_ASSET&file_path=/cms/asset/1684484329706_2.mp4"
		},
		{
			"sponsoredText": "Sponsored",
			"contentData": "http://kic-qt-ngfts.lge.com/fts/gftsDownload.lge?biz_code=CMS&func_code=CMS_ASSET&file_path=/cms/asset/1725862807492_1.png",
			"parentId": -1,
			"duration": 0,
			"id": 102003,
			"sequenceId": 3,
			"isCached": false,
			"type": "image",
			"rotationTime": 5,
			"mime": "image/png"
		},
		{
			"sponsoredText": "Sponsored",
			"contentData": "http://kic-qt-ngfts.lge.com/fts/gftsDownload.lge?biz_code=CMS&func_code=CMS_ASSET&file_path=/cms/asset/1713141121653_1.png",
			"parentId": -1,
			"duration": 0,
			"id": 1004,
			"sequenceId": 4,
			"isCached": false,
			"type": "image",
			"rotationTime": 5,
			"mime": "image/png"
		},
		{
			"sponsoredText": "Sponsored",
			"contentData": "http://kic-qt-ngfts.lge.com/fts/gftsDownload.lge?biz_code=CMS&func_code=CMS_ASSET&file_path=/cms/asset/1650507717418_3.mp4",
			"parentId": -1,
			"duration": 5,
			"id": 1005,
			"sequenceId": 5,
			"isCached": false,
			"type": "video",
			"rotationTime": 5,
			"mime": "video/mp4",
			"overlayText": "Click to Install",
		}
	]
};

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
	if (typeof window === 'object' && !window.PalmServiceBridge) {
		const mockResponse = Object.assign({}, mockBannerInfo);
		mockResponse.assets = groupBannerInfo(mockResponse.assets);
		return new Promise((resolve) => resolve(mockResponse));
	} else {
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
	}
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
