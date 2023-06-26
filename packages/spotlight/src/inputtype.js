/**
 * Exports methods for working with inputtype in spotlight
 *
 * @module spotlight/pointer
 * @private
 */

const input = {
	activated: false,
	applied: false,
	types: {
		key: true,
		mouse: false,
		touch: false
	}
};

const activateInputType = (activated) => {
	input.activated = activated;
};

const getInputType = () => {
	return Object.keys(input.types).find(type => input.types[type]);
};

const setInputType = (inputType) => {
	if (Object.prototype.hasOwnProperty.call(input.types, inputType) && !input.types[inputType]) {
		Object.keys(input.types).map((type) => {
			input.types[type] = false;
		});
		input.types[inputType] = true;

		input.applied = false;
	}
};

export {
	activateInputType,
	getInputType,
	input,
	setInputType
};
