/* eslint-disable no-console */
/* global console */

import LS2Request from '../LS2Request';
import {platform} from '../platform';

let audioGuidanceEnabled = null;

const checkAudioGuidance = () => new Promise((resolve, reject) => {
	if (audioGuidanceEnabled === null) {
		new LS2Request().send({
			service: 'luna://com.webos.settingsservice',
			method: 'getSystemSettings',
			subscribe: true,
			parameters: {
				'keys': ['audioGuidance'],
				'category': 'option'
			},
			onSuccess: function (res) {
				if (res && res.settings.audioGuidance === 'on') {
					audioGuidanceEnabled = true;
					resolve();
					return;
				}

				audioGuidanceEnabled = false;
				reject();
			},
			onFailure: function (err) {
				reject('Failed to get system AudioGuidance settings: ' + JSON.stringify(err));
			}
		});
	} else if (audioGuidanceEnabled) {
		resolve();
	} else {
		reject();
	}
});

const readAlertMessage = (string, clear) => () => new Promise((resolve, reject) => {
	new LS2Request().send({
		service: 'luna://com.webos.service.tts',
		method: 'speak',
		parameters: {'text': string, 'clear': clear},
		onSuccess: resolve,
		onFailure: (err) => {
			reject('Failed to readAlertMessage: ' + JSON.stringify(err));
		}
	});
});

/**
 * Read alert text when accessibility VoiceReadout enabled.
 *
 * @function
 * @param {String} string String to voice readout.
 * @param {Boolean} [clear=true] Clear option for TTS. If true, it will cut off previous reading.
 * @returns {undefined}
 * @memberof webos/speech
 */
const readAlert = (string, clear = true) => {
	if (platform.tv) {
		checkAudioGuidance()
			.then(readAlertMessage(string, clear))
			.catch(message => {
				if (message) {
					console.error(`Failed to readAlert: ${message}`);
				}
			});
	} else {
		console.warn('Platform doesn\'t support TTS api.');
	}
};

export default readAlert;
export {readAlert};
