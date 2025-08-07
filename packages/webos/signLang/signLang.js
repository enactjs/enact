/* eslint-disable no-console */
import { info } from '@enact/webos/pmloglib';
import LS2Request from '@enact/webos/LS2Request';
import { platform } from '@enact/webos/platform';

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
				info('enact_signLang_checkSignLang', { 'onSuccess': res }, '');

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
				info('enact_signLang_checkSignLang', { 'onFailure': err }, '');

				reject('Failed to get sign language setting value: ' + JSON.stringify(err));
			}
		});
	} else if (signLangEnabled) {
		resolve();
	} else {
		reject();
	}
});

const callSignLangAPI = (signLangId, active, option) => () => new Promise((resolve, reject) => {
	const parameters = { appId, 'signGuidanceId': signLangId, 'focusOut': !active, ...option };

	info('enact_signLang_callSignLangAPI', parameters, '');

	new LS2Request().send({
		service: 'luna://com.webos.service.signlanguageavatar',
		method: 'play',
		parameters,
		onSuccess: () => {
			option.onSuccess && option.onSuccess();
			resolve();
		},
		onFailure: (err) => {
			info('enact_signLang_callSignLangAPI', { 'onFailure': err }, '');

			reject('Failed to callSignLangAPI: ' + JSON.stringify(err));
		}
	});
});

const requestSignLang = (signLangId, active, option = {}) => {
	if (platform.tv) {
		checkSignLang()
			.then(callSignLangAPI(signLangId, active, option))
			.catch(message => {
				if (message) {
					console.error(`Failed to requestSignLang: ${message}`);
				}
			});
	} else {
		console.warn('Platform doesn\'t support sing language.');
	}
};

/**
 * Activates sign language based on the singLangID.
 *
 * @function
 * @param {String} [signLangId=''] signLangId Unique ID used for sign language.
 * @param {Object} [option={}] Additional option for sign language.
 * @returns {undefined}
 * @memberof webos/signLang
 * @public
 */
const startSignLang = (signLangId = '', option = {}) => {
	requestSignLang(signLangId, true, option);
};

/**
 * Deactivates sign language based on the signLangID.
 *
 * @function
 * @param {String} [signLangId=''] signLangId Unique ID used for sign language.
 * @param {Object} [option={}] Additional option for sign language.
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
