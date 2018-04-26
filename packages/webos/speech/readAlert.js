/* eslint-disable no-console */
/* global console */

import LS2Request from '../LS2Request';
import {platform} from '../platform';

/**
 * Read alert text when accessibility VoiceReadout enabled.
 *
 * @function
 * @param {String} string String to voice readout.
 * @param {Boolean} [clear=true] Clear option for TTS. If true, it will cutt off previous reading.
 * @returns {undefined}
 * @memberof webos/speech
 */
const readAlert = (string, clear = true) => {
	if (platform.tv) {
		const checkAudioGuidance = (callback) => new LS2Request().send({
			service: 'luna://com.webos.settingsservice',
			method: 'getSystemSettings',
			parameters: {'keys': ['audioGuidance'], 'category': 'option'},
			onSuccess: function (res) {
				if (res && res.settings.audioGuidance === 'on') {
					callback();
				}
			},
			onFailure: function (err) {
				console.error('Failed to get system AudioGuidance settings: ' + JSON.stringify(err));
			}
		});

		const readAlertMessage = () => new LS2Request().send({
			service: 'luna://com.webos.service.tts',
			method: 'speak',
			parameters: {'text': string, 'clear': clear},
			onFailure: (err) => {
				console.error('Failed to readAlertMessage: ' + JSON.stringify(err));
			}
		});

		checkAudioGuidance(readAlertMessage);
	} else {
		console.warn('Platform doesn\'t support TTS api.');
	}
};

export default readAlert;
export {readAlert};
