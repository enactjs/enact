/* eslint no-console: ["error", {allow: ["log"]}] */
import LS2Request from '../LS2Request';

const VoiceControl = (function () {
	let _initialized = false;
	let voiceArray = [];
	let lastID = -1;

	// this handler check matched item with voice info(voiceIntent, voiceLabel)
	// and execute onVoice handler of matched item
	function handleVoice (e) {
		let {voiceIntent, voiceLabel} = e;
		let intentArray = getArray(voiceArray, 'voiceIntent', voiceIntent);

		console.log('VoiceControl>handleVoice>', voiceIntent, voiceLabel, e);

		if (voiceLabel && intentArray.length > 0) {
			if (voiceLabel.toLowerCase) {
				voiceLabel = voiceLabel.toLowerCase();
			}

			let labelIndex = getIndex(intentArray, 'voiceLabel', voiceLabel);

			if (labelIndex > -1) { // execute onVoice handler
				let tObj = intentArray[labelIndex];
				if (tObj.onVoice && (typeof tObj.onVoice === 'function')) {
					// test
					if (voiceIntent === 'input') {
						e.value = 'text inputed!!!';
					} else if (voiceIntent === 'slider') {
						e.value = 50;
					} else if (voiceIntent === 'pick') {
						e.value = 'e';
					}

					tObj.onVoice(e);
					console.log('VoiceControl>handleVoice>execute!!!!!!>', voiceIntent, voiceLabel, labelIndex, e);
				}
			} else { // find dom node with text string (this feature will be covered with Web Engine)
				clickDOM(voiceLabel);
			}
		}
	}

	// this event handler is used temporary.
	// (it works now, but new interface will be made relate to voice framework)
	function webOSRelaunchHandler () {
		let params = JSON.parse(window.PalmSystem.launchParams);
		if (params.event) {
			if (params.event === 'text') {
				let str = params.result[0].ActionData.request.query || '';

				handleVoice({
					voiceLabel: str
				});
			} else if (params.event === 'start') {
				showToastPopup(); // this feature is not fixed by UX
			}
		}
	}

	function showToastPopup () {
		if (voiceArray.length > 0) {
			let str = '';

			for (let i in voiceArray) {
				if (voiceArray[i]['voiceLabel']) {
					str += voiceArray[i]['voiceLabel'] + ' | ';
				}
			}

			new LS2Request().send({
				service: 'luna://com.webos.notification',
				method: 'createToast',
				parameters: {
					'sourceId': 'com.palm.voicecontrol',
					'message': str,
					'noaction': false
				},
				onSuccess: function (res) {
					console.log('onSuccess', res);
				},
				onFailure: function (err) {
					console.log('onFailure', err);
				}
			});
		}
	}

	// this feature will be cover by Web Engine
	function clickDOM (label) {
		let nodes = document.querySelectorAll('.spottable');
		let texts = [];

		for (let t in nodes) {
			let node = nodes[t];
			let ariaLabel = node.getAttribute && node.getAttribute('aria-label');
			let textContent = node.textContent;
			let text = ariaLabel || textContent;

			if (text) {
				texts.push(text.toLowerCase());
			}
		}

		for (let i = 0; i < texts.length; i++) {
			let text = texts[i];
			if (text && text.indexOf(label.toLowerCase()) > -1) {
				nodes[i].click();
				console.log('VoiceControl>clickDOM>execute!!!!!!>', text);
				return;
			}
		}
	}

	function getIndex (array, prop, value) {
		for (let i in array) {
			if (array[i][prop] === value) {
				return i;
			}
		}
		return -1;
	}

	function getArray (array, prop, value) {
		let result = [];
		for (let i in array) {
			if (array[i][prop] === value) {
				result.push(array[i]);
			}
		}
		return result;
	}

	const exports = {
		initialize: function () {
			if (!_initialized) {
				_initialized = true;
				document.addEventListener('webOSRelaunch', webOSRelaunchHandler, true);
			}
		},

		terminate: function () {
			document.removeEventListener('webOSRelaunch', webOSRelaunchHandler, true);
		},

		isInitialize: function () {
			return _initialized;
		},

		add: function (obj) {
			voiceArray.push(obj);
		},

		addList: function (array) {
			let ids = [];
			for (let i in array) {
				let id = this.generateID();
				let {voiceIntent, voiceLabel, onVoice} = array[i];
				this.add({
					voiceID: id,
					voiceIntent,
					voiceLabel,
					onVoice
				});
				ids.push( {voiceID: id});
			}
			return ids;
		},

		remove: function (obj) {
			let tIndex = getIndex(voiceArray, 'voiceID', obj.voiceID);
			if (tIndex > -1) {
				voiceArray.splice(tIndex, 1);
			}
			this.traceArray();
		},

		removeList: function (array) {
			for (let i in array) {
				this.remove(array[i]);
			}
		},

		update: function (obj) {
			let tIndex = getIndex(voiceArray, 'voiceID', obj.voiceID);
			if (tIndex > -1) {
				voiceArray[tIndex].voiceLabel = obj.voiceLabel;
				voiceArray[tIndex].voiceIntent = obj.voiceIntent;
			}
		},

		generateID: function () {
			lastID += 1;
			return lastID + '';
		},

		traceArray: function () {
			console.log('VoiceControl>traceArray>', voiceArray);
			return voiceArray;
		},

		traceLabel: function () {
			let str = '';
			for (let i in voiceArray) {
				str += voiceArray[i]['voiceIntent'] + ' | ' + voiceArray[i]['voiceLabel'] + ' | ' + '\n';
			}
			console.log('VoiceControl>traceLabel>' + '\n' + str);
		},

		simulateVoice: function (obj) {
			console.log('VoiceControl>simulateOnVoice>', obj);
			handleVoice(obj);
		},

		simulateClick: function (label) {
			console.log('VoiceControl>simulateOnClick>', label);
			clickDOM(label);
		}
	};
	return exports;
})();

if (!VoiceControl.isInitialize()) {
	VoiceControl.initialize();
}

export default VoiceControl;
export {VoiceControl};
