/* eslint-disable no-console */

import LS2Request from '../LS2Request';
import {platform} from '../platform';
import {info} from '@enact/webos/pmloglib';

let signLangEnabled = null;
let appId = '';

const checkSignLang = () => new Promise((resolve, reject) => {
	if (signLangEnabled === null) {
		new LS2Request().send({
			service: 'luna://com.webos.settingsservice',
			method: 'getSystemSettings',
			subscribe: true,
			parameters: {
				'keys': ['signLanguageGuidance'],
				'category': 'option'
			},
			onSuccess: function (res) {
				info('enact_signlang_checkSignLang', {"onSuccess": res}, '');

				if (res && res.settings.signLanguageGuidance === 'on') {
					signLangEnabled = true;
					appId = typeof window == 'object' && window.PalmSystem && window.PalmSystem.getIdentifier && window.PalmSystem.getIdentifier();
					resolve();
					return;
				}

				signLangEnabled = false;
				reject();
			},
			onFailure: function (err) {
				info('enact_signlang_checkSignLang', {"onFailure": err}, '');

				reject('Failed to get sign language setting value: ' + JSON.stringify(err));
			}
		});
	} else if (signLangEnabled) {
		resolve();
	} else {
		reject();
	}
});

const requestSignLang = (signLangId, focusOut, option) => () => new Promise((resolve, reject) => {
	const parameters = {'appId': appId, 'signGuidanceId': signLangId, 'focusOut': focusOut, ...option};

	info('enact_signlang_requestSignLang', parameters, '');

	new LS2Request().send({
		service: 'luna://com.webos.service.signlanguageavatar',
		method: 'play',
		parameters: parameters,
		onSuccess: resolve,
		onFailure: (err) => {
			info('enact_signlang_requestSignLang', {"onFailure": err}, '');

			reject('Failed to requestSignLang: ' + JSON.stringify(err));
		}
	});
});

/**
 * Request sign language when sign language is enabled.
 *
 * @function
 * @param {String} text Text used in sign language.
 * @param {Boolean} [focusOut=false] Control the start and stop of sign language.
 * @param {Object} [option={}] Additional option in sign language.
 * @returns {undefined}
 * @memberof webos/signlang
 * @public
 */
const signLang = (signLangId, focusOut = false, option = {}) => {
	if (platform.tv) {
		checkSignLang()
			.then(requestSignLang(signLangId, focusOut, option))
			.catch(message => {
				if (message) {
					console.error(`Failed to requestSignLang: ${message}`);
				}
			});
	} else {
		console.warn('Platform doesn\'t support sing language api.');
	}
};

export default signLang;
export {
	signLang
};
