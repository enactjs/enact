import {select, isSelected} from '../selection';

describe.only('selection', () => {

	// isSelected

	it('should return true when item strictly equals selection', function () {
		const expected = true;
		const actual = isSelected(1, 1);

		expect(actual).to.equal(expected);
	});

	it('should return false when item loosely equals selection', function () {
		const expected = false;
		const actual = isSelected(0, null);

		expect(actual).to.equal(expected);
	});

	it('should return true when selection contains item', function () {
		const expected = true;
		const actual = isSelected(1, [1]);

		expect(actual).to.equal(expected);
	});

	it('should return false when selection does not contain item', function () {
		const expected = false;
		const actual = isSelected(1, [2]);

		expect(actual).to.equal(expected);
	});

	// Single mode

	it('should select item when there is no selection in "single" mode', function () {
		const item = 0;
		const selection = null;
		const mode = 'single';

		const expected = item;
		const actual = select(mode, item, selection);

		expect(actual).to.equal(expected);
	});

	it('should deselect item when it is selected in "single" mode', function () {
		const item = 0;
		const selection = item;
		const mode = 'single';

		const expected = null;
		const actual = select(mode, item, selection);

		expect(actual).to.equal(expected);
	});

	it('should select only the new item when another is selected in "single" mode', function () {
		const newItem = 1;
		const selection = 0;
		const mode = 'single';

		const expected = newItem;
		const actual = select(mode, newItem, selection);

		expect(actual).to.equal(expected);
	});

	it('should return a single item when an array is passed as selected in "single" mode', function () {
		const item = 0;
		const selection = [1];
		const mode = 'single';

		const expected = item;
		const actual = select(mode, item, selection);

		expect(actual).to.equal(expected);
	});

	it('should deselect the item when an array is passed as selected in "single" mode', function () {
		const item = 0;
		const selection = [item];
		const mode = 'single';

		const expected = null;
		const actual = select(mode, item, selection);

		expect(actual).to.equal(expected);
	});

	// Radio Mode

	it('should select item when there is no selection in "radio" mode', function () {
		const item = 0;
		const selection = null;
		const mode = 'radio';

		const expected = item;
		const actual = select(mode, item, selection);

		expect(actual).to.equal(expected);
	});

	it('should not deselect item when selecting it again in "radio" mode', function () {
		const item = 0;
		const selection = item;
		const mode = 'radio';

		const expected = item;
		const actual = select(mode, item, selection);

		expect(actual).to.equal(expected);
	});

	it('should select only the new item when another is selected in "radio" mode', function () {
		const item = 1;
		const selection = 0;
		const mode = 'radio';

		const expected = item;
		const actual = select(mode, item, selection);

		expect(actual).to.equal(expected);
	});

	it('should return a single item when an array is passed as selected in "radio" mode', function () {
		const item = 0;
		const selection = [1];
		const mode = 'radio';

		const expected = item;
		const actual = select(mode, item, selection);

		expect(actual).to.equal(expected);
	});

	it('should not deselect the item when an array is passed as selected in "radio" mode', function () {
		const item = 0;
		const selection = [item];
		const mode = 'radio';

		const expected = item;
		const actual = select(mode, item, selection);

		expect(actual).to.equal(expected);
	});

	// Multiple mode

	it('should select item when there is no selection in "multiple" mode', function () {
		const item = 0;
		const selection = null;
		const mode = 'multiple';

		const expected = [item];
		const actual = select(mode, item, selection);

		expect(actual).to.deep.equal(expected);
	});

	it('should return null when deselecting the only item in "multiple" mode', function () {
		const item = 0;
		const selection = item;
		const mode = 'multiple';

		const expected = null;
		const actual = select(mode, item, selection);

		expect(actual).to.equal(expected);
	});

	it('should return null when deselecting the only item as an array in "multiple" mode', function () {
		const item = 0;
		const selection = [item];
		const mode = 'multiple';

		const expected = null;
		const actual = select(mode, item, selection);

		expect(actual).to.equal(expected);
	});

	it('should select new item when there is a selection', function () {
		const item = 1;
		const selection = 0;
		const mode = 'multiple';

		const expected = [0, 1];
		const actual = select(mode, item, selection);

		expect(actual).to.deep.equal(expected);
	});

	it('should deselect only item when there is a selection', function () {
		const selection = [0, 1];
		const item = 1;
		const mode = 'multiple';

		const expected = [0];
		const actual = select(mode, item, selection);

		expect(actual).to.deep.equal(expected);
	});

	it('should sort selection', function () {
		const selection = [3, 1, 2, 5];
		const item = 0;
		const mode = 'multiple';

		const expected = [0, 1, 2, 3, 5];
		const actual = select(mode, item, selection);

		expect(actual).to.deep.equal(expected);
	});

});
