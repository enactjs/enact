import * as keymap from '../';

describe('keymap', () => {

	it('should support adding single keyCodes for a name', function () {
		keymap.add('enter', 13);

		const expected = true;
		const actual = keymap.is('enter', 13);

		keymap.remove('enter', 13);

		expect(actual).to.equal(expected);
	});

	it('should support removing a single keyCode for a name', function () {
		keymap.add('enter', 13);
		keymap.remove('enter', 13);

		const expected = false;
		const actual = keymap.is('enter', 13);

		expect(actual).to.equal(expected);
	});

	it('should support adding an array of keyCodes for a name', function () {
		keymap.add('enter', [13, 16777221]);

		const expected = true;
		const actual = keymap.is('enter', 13) && keymap.is('enter', 16777221);

		keymap.remove('enter', 13);
		keymap.remove('enter', 16777221);

		expect(actual).to.equal(expected);
	});

	it('should support removing an array of keyCodes for a name', function () {
		keymap.add('enter', [13, 16777221]);
		keymap.remove('enter', [13, 16777221]);

		const expected = false;
		const actual = keymap.is('enter', 13) || keymap.is('enter', 16777221);

		expect(actual).to.equal(expected);
	});

	it('should support adding an map of keyCodes', function () {
		const map = {
			enter: [13, 16777221],
			up: 38,
			down: 40
		};
		keymap.addAll(map);

		const expected = true;
		const actual =	keymap.is('enter', 13) &&
						keymap.is('enter', 16777221) &&
						keymap.is('up', 38) &&
						keymap.is('down', 40);

		keymap.removeAll(map);

		expect(actual).to.equal(expected);
	});

	it('should removing an map of keyCodes', function () {
		const map = {
			enter: [13, 16777221],
			up: 38,
			down: 40
		};
		keymap.addAll(map);
		keymap.removeAll(map);

		const expected = false;
		const actual =	keymap.is('enter', 13) ||
						keymap.is('enter', 16777221) ||
						keymap.is('up', 38) ||
						keymap.is('down', 40);


		expect(actual).to.equal(expected);
	});
});
