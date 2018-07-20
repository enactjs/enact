import * as keymap from '../';

describe('keymap', () => {

	it('should support adding single keyCodes for a name', function () {
		keymap.add('testEnter', 13);

		const expected = true;
		const actual = keymap.is('testEnter', 13);

		keymap.remove('testEnter', 13);

		expect(actual).to.equal(expected);
	});

	it('should support removing a single keyCode for a name', function () {
		keymap.add('testEnter', 13);
		keymap.remove('testEnter', 13);

		const expected = false;
		const actual = keymap.is('testEnter', 13);

		expect(actual).to.equal(expected);
	});

	it('should support adding an array of keyCodes for a name', function () {
		keymap.add('testEnter', [13, 16777221]);

		const expected = true;
		const actual = keymap.is('testEnter', 13) && keymap.is('testEnter', 16777221);

		keymap.remove('testEnter', [13, 16777221]);

		expect(actual).to.equal(expected);
	});

	it('should support removing an array of keyCodes for a name', function () {
		keymap.add('testEnter', [13, 16777221]);
		keymap.remove('testEnter', [13, 16777221]);

		const expected = false;
		const actual = keymap.is('testEnter', 13) || keymap.is('testEnter', 16777221);

		expect(actual).to.equal(expected);
	});

	it('should support adding an map of keyCodes', function () {
		const map = {
			testEnter: [13, 16777221],
			testUp: 38,
			testDown: 40
		};
		keymap.addAll(map);

		const expected = true;
		const actual =	keymap.is('testEnter', 13) &&
						keymap.is('testEnter', 16777221) &&
						keymap.is('testUp', 38) &&
						keymap.is('testDown', 40);

		keymap.removeAll(map);

		expect(actual).to.equal(expected);
	});

	it('should removing an map of keyCodes', function () {
		const map = {
			testEnter: [13, 16777221],
			testUp: 38,
			testDown: 40
		};
		keymap.addAll(map);
		keymap.removeAll(map);

		const expected = false;
		const actual =	keymap.is('testEnter', 13) ||
						keymap.is('testEnter', 16777221) ||
						keymap.is('testUp', 38) ||
						keymap.is('testDown', 40);


		expect(actual).to.equal(expected);
	});

	it('should use case-insensitive names', function () {
		keymap.add('testEnter', 13);

		const expected = true;
		const actual = keymap.is('TeStEnTeR', 13);

		keymap.remove('testEnter', 13);

		expect(actual).to.equal(expected);
	});

	it('should not add entry with a falsy name', function () {
		keymap.add('', 13);

		const expected = false;
		const actual = keymap.is('', 13);

		expect(actual).to.equal(expected);
	});
});
