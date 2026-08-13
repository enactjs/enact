/**
 * Exports methods for working with inputType in spotlight
 *
 * @module spotlight/inputType
 * @private
 */

import type {InputInfo, InputType} from '../types/InputType';

interface InputState {
	activated: boolean;
	applied: boolean;
	types: Record<InputType, boolean>;
}

const input: InputState = {
	activated: false,
	applied: false,
	types: {
		key: true,
		mouse: false,
		touch: false
	}
};

const activateInputType = (activated: boolean): void => {
	input.activated = activated;
};

const getInputType = (): InputType | undefined => {
	return (Object.keys(input.types) as InputType[]).find(type => input.types[type]);
};

const setInputType = (inputType: InputType): void => {
	if (Object.prototype.hasOwnProperty.call(input.types, inputType) && !input.types[inputType]) {
		(Object.keys(input.types) as InputType[]).map((type) => {
			input.types[type] = false;
		});
		input.types[inputType] = true;

		input.applied = false;
	}
};

const applyInputTypeToNode = (node: Element): void => {
	(Object.keys(input.types) as InputType[]).map((type) => {
		node.classList.toggle('spotlight-input-' + type, input.types[type]);
	});
	input.applied = true;
};

const getInputInfo = (): InputInfo => {
	return {activated: input.activated, applied: input.applied};
};

export {
	activateInputType,
	applyInputTypeToNode,
	getInputInfo,
	getInputType,
	setInputType
};
