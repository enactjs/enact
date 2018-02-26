/* eslint no-console: ["error", {allow: ["log"]}] */
const VoiceControl = (function () {
	let _initialized = false;
	let voiceArray = [];
	let lastID = -1;

	function handleVoice (str) {
		let result = JSON.parse(str);
		let obj = result[0];
		let voiceIntent = obj['Intent'];
		let voiceLabel = obj['Slot1'];
		let intentArray = getArray(voiceArray, 'voiceIntent', voiceIntent);

		if (intentArray.length > 0) {
			if (voiceLabel) {
				let labelIndex = getIndex(intentArray, 'voiceLabel', voiceLabel);
				if (labelIndex > -1) { // execute onVoice handler
					let tObj = intentArray[labelIndex];
					if (tObj.onVoice && (typeof tObj.onVoice === 'function')) {
						tObj.onVoice(obj);
						console.log('VoiceControl>handleVoice>voiceLabel exist!!!!!!>', voiceIntent, voiceLabel, obj);
					}
				} else {
					console.log('VoiceControl>handleVoice>voiceLabel is exist, but not matched!!!!!!>', voiceIntent, voiceLabel, obj);
				}
			} else {
				let tObj = intentArray[0];
				if (tObj.onVoice && (typeof tObj.onVoice === 'function')) {
					tObj.onVoice(obj);
					console.log('VoiceControl>handleVoice>voiceLabel is not exist!!!!!!>', voiceIntent, voiceLabel, obj);
				}
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
				// showToastPopup();
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

	function getJsonData (array) {
		let result = [];
		for (let i = 0; i < array.length; i++) {
			let obj = array[i];
			let index = hasProp(result, 'Intent', obj.voiceIntent);
			if (index === -1) {
				result.push({
					'Intent': obj.voiceIntent,
					'Values': [obj.voiceLabel]
				});
			} else {
				result[index]['Values'].push(obj.voiceLabel);
			}
		}
		return JSON.stringify(result);
	}

	function hasProp (array, prop, value) {
		for (let i = 0; i < array.length; i++) {
			if (array[i][prop] === value) {
				return i;
			}
		}
		return -1;
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

		traceJsonData: function () {
			console.log('traceJsonData>', getJsonData(voiceArray));
		},

		simulateVoice: function (str) {
			console.log('VoiceControl>simulateOnVoice>', str);
			handleVoice(str);
		},

		simulateJson: function (type) {
			let str = '';
			if (type === 'Button') {
				str = '[{"Intent": "ClickRequest","Slot1": "A"}]';
			} else if (type === 'CheckboxItem') {
				str = '[{"Intent": "CheckItemRequest","Slot1": "BB", "Slot2": "checked"}]';
			} else if (type === 'Radioitem') {
				str = '[{"Intent": "CheckItemRequest","Slot1": "b", "Slot2": "checked"}]';
			} else if (type === 'Toggleitem') {
				str = '[{"Intent": "CheckItemRequest","Slot1": "Energy Saver", "Slot2": "unchecked"}]';
			} else if (type === 'Input') {
				str = '[{"Intent": "TextInputRequest","Slot1": "TV Name", "Slot2": "this is good!!!"}]';
			}
			console.log('simulateJson>', str, JSON.parse(str));
			handleVoice(str);
		}
	};
	return exports;
})();

if (!VoiceControl.isInitialize()) {
	VoiceControl.initialize();
}

export default VoiceControl;
export {VoiceControl};
