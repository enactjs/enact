import {getFocusEffectClass, setFocusEffectClass} from '../focusEffect';

describe('focusEffect', () => {
	afterEach(() => {
		setFocusEffectClass(null);
	});

	describe('getFocusEffectClass', () => {
		test('should return null by default', () => {
			expect(getFocusEffectClass()).toBeNull();
		});

		test('should return the class name set by setFocusEffectClass', () => {
			setFocusEffectClass('my-focus-class');

			expect(getFocusEffectClass()).toBe('my-focus-class');
		});

		test('should return updated class after multiple setFocusEffectClass calls', () => {
			setFocusEffectClass('first-class');
			setFocusEffectClass('second-class');

			expect(getFocusEffectClass()).toBe('second-class');
		});
	});

	describe('setFocusEffectClass', () => {
		test('should set the focus class', () => {
			setFocusEffectClass('custom-class');

			expect(getFocusEffectClass()).toBe('custom-class');
		});

		test('should clear the focus class when passed null', () => {
			setFocusEffectClass('custom-class');
			setFocusEffectClass(null);

			expect(getFocusEffectClass()).toBeNull();
		});

		test('should clear the focus class when passed an empty string', () => {
			setFocusEffectClass('custom-class');
			setFocusEffectClass('');

			expect(getFocusEffectClass()).toBeNull();
		});

		test('should support space-separated class names as a single string', () => {
			setFocusEffectClass('class-a class-b');

			expect(getFocusEffectClass()).toBe('class-a class-b');
		});
	});
});
