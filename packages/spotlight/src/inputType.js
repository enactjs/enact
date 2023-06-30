/**
 * Exports methods for working with inputType in spotlight
 *
 * @module spotlight/inputType
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

const applyInputTypeToNode = (node) => {
	Object.keys(input.types).map((type) => {
		node.classList.toggle('spotlight-input-' + type, input.types[type]);
	});
	input.applied = true;
};

const getInputInfo = () => {
	return {activated: input.activated, applied: input.applied};
};

export {
	activateInputType,
	applyInputTypeToNode,
	getInputInfo,
	getInputType,
	setInputType
};

