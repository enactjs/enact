import {select, isSelected} from '../selection';

describe('selection', () => {

	// isSelected

	test('should return true when item strictly equals selection', () => {
		const expected = true;
		const actual = isSelected(1, 1);

		expect(actual).toBe(expected);
	});

	test('should return false when item loosely equals selection', () => {
		const expected = false;
		const actual = isSelected(0, null);

		expect(actual).toBe(expected);
	});

	test('should return true when selection contains item', () => {
		const expected = true;
		const actual = isSelected(1, [1]);

		expect(actual).toBe(expected);
	});

	test('should return false when selection does not contain item', () => {
		const expected = false;
		const actual = isSelected(1, [2]);

		expect(actual).toBe(expected);
	});

	// Single mode

	test(
		'should select item when there is no selection in "single" mode',
		() => {
			const item = 0;
			const selection = null;
			const mode = 'single';

			const expected = item;
			const actual = select(mode, item, selection);

			expect(actual).toBe(expected);
		}
	);

	test('should deselect item when it is selected in "single" mode', () => {
		const item = 0;
		const selection = item;
		const mode = 'single';

		const expected = null;
		const actual = select(mode, item, selection);

		expect(actual).toBe(expected);
	});

	test(
		'should select only the new item when another is selected in "single" mode',
		() => {
			const newItem = 1;
			const selection = 0;
			const mode = 'single';

			const expected = newItem;
			const actual = select(mode, newItem, selection);

			expect(actual).toBe(expected);
		}
	);

	test(
		'should return a single item when an array is passed as selected in "single" mode',
		() => {
			const item = 0;
			const selection = [1];
			const mode = 'single';

			const expected = item;
			const actual = select(mode, item, selection);

			expect(actual).toBe(expected);
		}
	);

	test(
		'should deselect the item when an array is passed as selected in "single" mode',
		() => {
			const item = 0;
			const selection = [item];
			const mode = 'single';

			const expected = null;
			const actual = select(mode, item, selection);

			expect(actual).toBe(expected);
		}
	);

	// Radio Mode

	test(
		'should select item when there is no selection in "radio" mode',
		() => {
			const item = 0;
			const selection = null;
			const mode = 'radio';

			const expected = item;
			const actual = select(mode, item, selection);

			expect(actual).toBe(expected);
		}
	);

	test(
		'should not deselect item when selecting it again in "radio" mode',
		() => {
			const item = 0;
			const selection = item;
			const mode = 'radio';

			const expected = item;
			const actual = select(mode, item, selection);

			expect(actual).toBe(expected);
		}
	);

	test(
		'should select only the new item when another is selected in "radio" mode',
		() => {
			const item = 1;
			const selection = 0;
			const mode = 'radio';

			const expected = item;
			const actual = select(mode, item, selection);

			expect(actual).toBe(expected);
		}
	);

	test(
		'should return a single item when an array is passed as selected in "radio" mode',
		() => {
			const item = 0;
			const selection = [1];
			const mode = 'radio';

			const expected = item;
			const actual = select(mode, item, selection);

			expect(actual).toBe(expected);
		}
	);

	test(
		'should not deselect the item when an array is passed as selected in "radio" mode',
		() => {
			const item = 0;
			const selection = [item];
			const mode = 'radio';

			const expected = item;
			const actual = select(mode, item, selection);

			expect(actual).toBe(expected);
		}
	);

	// Multiple mode

	test(
		'should select item when there is no selection in "multiple" mode',
		() => {
			const item = 0;
			const selection = null;
			const mode = 'multiple';

			const expected = [item];
			const actual = select(mode, item, selection);

			expect(actual).toEqual(expected);
		}
	);

	test(
		'should return null when deselecting the only item in "multiple" mode',
		() => {
			const item = 0;
			const selection = item;
			const mode = 'multiple';

			const expected = null;
			const actual = select(mode, item, selection);

			expect(actual).toBe(expected);
		}
	);

	test(
		'should return null when deselecting the only item as an array in "multiple" mode',
		() => {
			const item = 0;
			const selection = [item];
			const mode = 'multiple';

			const expected = null;
			const actual = select(mode, item, selection);

			expect(actual).toBe(expected);
		}
	);

	test('should select new item when there is a selection', () => {
		const item = 1;
		const selection = 0;
		const mode = 'multiple';

		const expected = [0, 1];
		const actual = select(mode, item, selection);

		expect(actual).toEqual(expected);
	});

	test('should deselect only item when there is a selection', () => {
		const selection = [0, 1];
		const item = 1;
		const mode = 'multiple';

		const expected = [0];
		const actual = select(mode, item, selection);

		expect(actual).toEqual(expected);
	});

	test('should sort selection', () => {
		const selection = [3, 1, 2, 5];
		const item = 0;
		const mode = 'multiple';

		const expected = [0, 1, 2, 3, 5];
		const actual = select(mode, item, selection);

		expect(actual).toEqual(expected);
	});

});
