/**
 * Provides a function to get the device-specific information.
 *
 * @module webos/deviceinfo
 * @exports deviceinfo
 */
import LS2Request from '../LS2Request';
import {platform} from '../platform';

const device = {};

/**
 * @callback webOS~deviceCallback
 * @param {Object} info - JSON object containing the device information details
 * @param {String} info.modelName Model name of device in UTF-8 format
 * @param {String} info.modelNameAscii Model name of device in ASCII format
 * @param {String} info.version Full OS firmware version string
 * @param {Number} info.versionMajor Subset of OS version string: Major version number
 * @param {Number} info.versionMinor Subset of OS version string: Minor version number
 * @param {Number} info.versionDot Subset of OS version string: Dot version number
 * @param {String} info.sdkVersion webOS SDK version
 * @param {Number} info.screenWidth Width in pixels
 * @param {Number} info.screenHeight Height in pixels
 * @param {Boolean} [info.uhd] Whether supports Ultra HD resolution.
 */

/**
 * Gets the device-specific information regarding model, OS version, specifications, etc.
 *
 * @function
 * @param {webOS~deviceCallback} callback - The function to call once the information is collected
 * @returns {undefined}
 * @memberof webos/deviceinfo
 * @public
 */
const deviceinfo = (callback) => {
	if (Object.keys(device).length === 0) {
		try {
			const info = JSON.parse(window.PalmSystem.deviceInfo);
			device.modelName = info.modelName;
			device.modelNameAscii = info.modelNameAscii;
			device.version = info.platformVersion;
			device.versionMajor = info.platformVersionMajor;
			device.versionMinor = info.platformVersionMinor;
			device.versionDot = info.platformVersionDot;
			device.sdkVersion = info.platformVersion;
			device.screenWidth = info.screenWidth;
			device.screenHeight = info.screenHeight;
		} catch (e) {
			device.modelName = device.modelNameAscii = 'webOS Device';
		}
		device.screenHeight = device.screenHeight || window.screen.height;
		device.screenWidth = device.screenWidth || window.screen.width;

		if (platform.tv) {
			new LS2Request().send({
				service: 'luna://com.webos.service.tv.systemproperty',
				method: 'getSystemInfo',
				parameters: {'keys': ['firmwareVersion', 'modelName', 'sdkVersion', 'UHD']},
				onSuccess: (response) => {
					device.modelName = response.modelName || device.modelName;
					device.modelNameAscii  = response.modelName || device.modelNameAscii;
					device.sdkVersion  = response.sdkVersion || device.sdkVersion;
					device.uhd = (response.UHD === 'true');
					if (!response.firmwareVersion || response.firmwareVersion === '0.0.0') {
						response.firmwareVersion = response.sdkVersion;
					}
					if (response.firmwareVersion) {
						device.version = response.firmwareVersion;
						const segments = device.version.split('.');
						const keys = ['versionMajor', 'versionMinor', 'versionDot'];
						for (let i = 0; i < keys.length; i++) {
							try {
								device[keys[i]] = parseInt(segments[i]);
							} catch (e) {
								device[keys[i]] = segments[i];
							}
						}
					}
					callback(device);
				},
				onFailure: () => {
					callback(device);
				}
			});
		}
	} else {
		callback(device);
	}
};

export default deviceinfo;
export {
	deviceinfo
};
