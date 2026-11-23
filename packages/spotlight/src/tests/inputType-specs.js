import {activateInputType, applyInputTypeToNode, getInputInfo, getInputType, setInputType} from '../inputType';

describe('inputType', () => {
	test('should have a default input type as \'key\'', () => {
		const expected = 'key';
		const actual = getInputType();

		expect(actual).toBe(expected);
	});

	test('should ignore input type in internal variable when invalid type is set', () => {
		setInputType('none');

		const expected = 'key';
		const actual = getInputType();

		expect(actual).toBe(expected);
	});

	test('should set input type properly in internal variable', () => {
		setInputType('touch');

		const expected = 'touch';
		const actual = getInputType();

		expect(actual).toBe(expected);
	});

	test('should report whether input type handling is activated', () => {
		activateInputType(true);
		const activated = getInputInfo().activated;

		activateInputType(false);

		expect(activated).toBe(true);
		expect(getInputInfo().activated).toBe(false);
	});

	test('should apply a class for the current input type to a node', () => {
		const node = document.createElement('div');
		setInputType('mouse');

		applyInputTypeToNode(node);

		expect(node.classList.contains('spotlight-input-mouse')).toBe(true);
		expect(node.classList.contains('spotlight-input-key')).toBe(false);
		expect(node.classList.contains('spotlight-input-touch')).toBe(false);
		expect(getInputInfo().applied).toBe(true);
	});

	test('should mark the input type as not applied when it changes', () => {
		const node = document.createElement('div');
		setInputType('mouse');
		applyInputTypeToNode(node);

		setInputType('key');

		expect(getInputInfo().applied).toBe(false);
	});
});
