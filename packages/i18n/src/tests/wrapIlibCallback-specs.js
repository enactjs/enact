import wrapIlibCallback from '../wrapIlibCallback';

describe('wrapIlibCallback', () => {
	describe('when `fn` is provided', () => {
		test('should return the result directly in sync mode', () => {
			const expected = 'result';
			const fn = ({onLoad}) => onLoad('result');
			const actual = wrapIlibCallback(fn, {sync: true});

			expect(actual).toEqual(expected);
		});

		test('should also invoke the caller-supplied onLoad in sync mode', () => {
			const fn = ({onLoad: report}) => report('result');
			const onLoad = jest.fn();
			wrapIlibCallback(fn, {sync: true, onLoad});

			expect(onLoad).toHaveBeenCalledWith('result');
		});

		test('should return a Promise resolving to the result in async mode', async () => {
			const expected = 'result';
			const fn = ({onLoad}) => onLoad('result');
			const actual = await wrapIlibCallback(fn, {sync: false});

			expect(actual).toEqual(expected);
		});

		test('should also invoke the caller-supplied onLoad in async mode', async () => {
			const fn = ({onLoad: report}) => report('result');
			const onLoad = jest.fn();
			await wrapIlibCallback(fn, {sync: false, onLoad});

			expect(onLoad).toHaveBeenCalledWith('result');
		});

		test('should default to async mode when `sync` is omitted', () => {
			const fn = ({onLoad}) => onLoad('result');
			const actual = wrapIlibCallback(fn);

			expect(actual).toBeInstanceOf(Promise);
		});
	});

	describe('when `fn` is not provided', () => {
		test('should return `null` in sync mode', () => {
			const actual = wrapIlibCallback(null, {sync: true});

			expect(actual).toBeNull();
		});

		test('should return a Promise resolving to `null` in async mode', async () => {
			const actual = await wrapIlibCallback(null, {sync: false});

			expect(actual).toBeNull();
		});

		test('should return a Promise resolving to `null` when called with no options at all', async () => {
			const actual = await wrapIlibCallback(null);

			expect(actual).toBeNull();
		});
	});
});
