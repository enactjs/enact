import {addAll, removeAll} from '@enact/core/keymap';

import {
	getLastPointerPosition,
	getPointerMode,
	notifyKeyDown,
	notifyPointerMove,
	setPointerMode,
	updatePointerPosition
} from '../pointer';

const reset = () => {
	updatePointerPosition(null, null);
	setPointerMode(true);
};

describe('pointer', () => {
	afterEach(reset);

	describe('#getLastPointerPosition', () => {
		it('should return an object with x and y keys', () => {
			const expected = ['x', 'y'];
			const actual = Object.keys(getLastPointerPosition());

			expect(actual).to.deep.equal(expected);
		});
	});

	describe('#notifyKeyDown', () => {
		// notifyKeyDown() will start a job which will set pointer mode for `pointerHide` key
		// events. If adding async tests, be sure to pass a callback to notifyKeyDown() to be
		// notified when the job completes before continuing.

		const keyMap = {
			pointerHide: 999,
			pointerShow: 888
		};

		before(() => addAll(keyMap));
		after(() => removeAll(keyMap));

		beforeEach(() => {
			// establish a consistent pointer mode state for each test
			setPointerMode(false);
		});

		it('should return true for pointer hide key events', () => {
			const expected = true;
			const actual = notifyKeyDown(keyMap.pointerHide);

			expect(actual).to.equal(expected);
		});

		it('should return true for pointer show key events', () => {
			const expected = true;
			const actual = notifyKeyDown(keyMap.pointerShow);

			expect(actual).to.equal(expected);
		});

		it('should enable pointer mode for pointer show key events', () => {
			notifyKeyDown(keyMap.pointerShow);

			const expected = true;
			const actual = getPointerMode();

			expect(actual).to.equal(expected);
		});

		it('should disable pointer mode for pointer show key events', (done) => {
			setPointerMode(true);
			notifyKeyDown(keyMap.pointerHide, () => {
				const expected = false;
				const actual = getPointerMode();

				expect(actual).to.equal(expected);

				done();
			});
		});

		it('should disable pointer mode for non-pointer key events', () => {
			setPointerMode(true);
			notifyKeyDown(12);

			const expected = false;
			const actual = getPointerMode();

			expect(actual).to.equal(expected);
		});
	});

	describe('#notifyPointerMove', () => {
		it('should update the pointer position if x changes', () => {
			const x = 20;

			notifyPointerMove(null, null, x, null);

			const expected = 20;
			const actual = getLastPointerPosition().x;

			expect(actual).to.equal(expected);
		});

		it('should update the pointer position if y changes', () => {
			const y = 20;

			notifyPointerMove(null, null, null, y);

			const expected = 20;
			const actual = getLastPointerPosition().y;

			expect(actual).to.equal(expected);
		});

		it('should enable pointer mode if the pointer positionchanges', () => {
			setPointerMode(false);
			notifyPointerMove(null, null, 5, 5);

			const expected = true;
			const actual = getPointerMode();

			expect(actual).to.equal(expected);
		});

		it('should return false if the pointer has not moved', () => {
			notifyPointerMove(null, null, 5, 5);

			const expected = false;
			const actual = notifyPointerMove(null, null, 5, 5);

			expect(actual).to.equal(expected);
		});

		it('should return true if pointer mode was disabled', () => {
			// change into pointer mode indicates a potential for change of focus
			setPointerMode(false);

			const expected = true;
			const actual = notifyPointerMove(null, null, 5, 5);

			expect(actual).to.equal(expected);
		});

		it('should return true if the pointer has moved and current is falsy', () => {
			const expected = true;
			const actual = notifyPointerMove(null, null, 5, 5);

			expect(actual).to.equal(expected);
		});

		it('should return false if the pointer has moved and target is within current', () => {
			const current = document.createElement('div');
			const target = document.createElement('div');
			current.appendChild(target);

			notifyPointerMove(null, current, 5, 5);

			const expected = false;
			const actual = notifyPointerMove(current, target, 10, 10);

			expect(actual).to.equal(expected);
		});

		it('should return true if the pointer has moved and target is not within current', () => {
			const current = document.createElement('div');
			const target = document.createElement('div');

			notifyPointerMove(null, current, 5, 5);

			const expected = true;
			const actual = notifyPointerMove(current, target, 10, 10);

			expect(actual).to.equal(expected);
		});
	});
});
