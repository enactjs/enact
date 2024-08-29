/* eslint-disable no-console */

import {info} from '@enact/webos/pmloglib';
import LS2Request from '../LS2Request';
import {platform} from '../platform';

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
				info('enact_signLang_checkSignLang', {'onSuccess': res}, '');

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
				info('enact_signLang_checkSignLang', {'onFailure': err}, '');

				reject('Failed to get sign language setting value: ' + JSON.stringify(err));
			}
		});
	} else if (signLangEnabled) {
		resolve();
	} else {
		reject();
	}
});

const requestSignLangAPI = (signLangId, activate, option) => () => new Promise((resolve, reject) => {
	const parameters = {appId, 'signGuidanceId': signLangId, 'focusOut': !activate, ...option};

	info('enact_signLang_requestSignLangAPI', parameters, '');

	new LS2Request().send({
		service: 'luna://com.webos.service.signlanguageavatar',
		method: 'play',
		parameters,
		onSuccess: resolve,
		onFailure: (err) => {
			info('enact_signLang_requestSignLangAPI', {'onFailure': err}, '');

			reject('Failed to requestSignLang: ' + JSON.stringify(err));
		}
	});
});

const requestSignLang = (signLangId, activate, option = {}) => {
	if (platform.tv) {
		checkSignLang()
			.then(requestSignLangAPI(signLangId, activate, option))
			.catch(message => {
				if (message) {
					console.error(`Failed to requestSignLang: ${message}`);
				}
			});
	} else {
		console.warn('Platform doesn\'t support sing language api.');
	}
};

/**
 * Start sign language when sign language is enabled.
 *
 * @function
 * @param {String} signLangId Unique ID used in sign language.
 * @param {Object} [option={}] Additional option in sign language.
 * @returns {undefined}
 * @memberof webos/signLang
 * @public
 */
const startSignLang = (signLangId = '', option = {}) => {
	requestSignLang(signLangId, true, option);
};

/**
 * Stop sign language.
 *
 * @function
 * @param {String} signLangId Unique ID used in sign language.
 * @param {Object} [option={}] Additional option in sign language.
 * @returns {undefined}
 * @memberof webos/signLang
 * @public
 */
const stopSignLang = (signLangId = '', option = {}) => {
	requestSignLang(signLangId, false, option);
};

export {
	startSignLang,
	stopSignLang
};
