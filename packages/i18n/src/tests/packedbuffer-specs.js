import PackedBuffer from '../packedbuffer';

describe('PackedBuffer', () => {
	describe('constructor', () => {
		test('should initialize the index to 0', () => {
			const expected = 0;
			const actual = new PackedBuffer([1, 2, 3]).index;

			expect(actual).toEqual(expected);
		});
	});

	describe('getUnsignedBytes', () => {
		test('should return the requested number of unsigned bytes', () => {
			const expected = [10, 20];
			const actual = new PackedBuffer([10, 20, 30]).getUnsignedBytes(2);

			expect(actual).toEqual(expected);
		});

		test('should advance the index by the number of bytes read', () => {
			const expected = 2;
			const buffer = new PackedBuffer([10, 20, 30]);
			buffer.getUnsignedBytes(2);

			expect(buffer.index).toEqual(expected);
		});

		test('should return only the bytes available when fewer remain than requested', () => {
			const expected = [10, 20];
			const actual = new PackedBuffer([10, 20]).getUnsignedBytes(5);

			expect(actual).toEqual(expected);
		});

		test('should return `undefined` when the buffer is already fully consumed', () => {
			const buffer = new PackedBuffer([10]);
			buffer.getUnsignedBytes(1);
			const actual = buffer.getUnsignedBytes(1);

			expect(actual).toBeUndefined();
		});

		test('should return `undefined` for an empty buffer', () => {
			const actual = new PackedBuffer([]).getUnsignedBytes(1);

			expect(actual).toBeUndefined();
		});
	});

	describe('getBytes', () => {
		test('should leave values below 0x80 unchanged', () => {
			const expected = [0, 127];
			const actual = new PackedBuffer([0, 127]).getBytes(2);

			expect(actual).toEqual(expected);
		});

		test('should convert values 0x80 and above to their signed representation', () => {
			const expected = [-128, -1, -56];
			const actual = new PackedBuffer([0x80, 0xFF, 200]).getBytes(3);

			expect(actual).toEqual(expected);
		});

		test('should return `undefined` when the buffer is already fully consumed', () => {
			const buffer = new PackedBuffer([1]);
			buffer.getBytes(1);
			const actual = buffer.getBytes(1);

			expect(actual).toBeUndefined();
		});
	});

	describe('getByte', () => {
		test('should return a single signed byte', () => {
			const expected = -56;
			const actual = new PackedBuffer([200]).getByte();

			expect(actual).toEqual(expected);
		});

		test('should advance the index by 1', () => {
			const expected = 1;
			const buffer = new PackedBuffer([200, 201]);
			buffer.getByte();

			expect(buffer.index).toEqual(expected);
		});

		test('should return `undefined` when no bytes remain', () => {
			const actual = new PackedBuffer([]).getByte();

			expect(actual).toBeUndefined();
		});
	});

	describe('getLongs', () => {
		test('should read big-endian 4-byte values', () => {
			const expected = [300];
			const actual = new PackedBuffer([0, 0, 1, 44]).getLongs(1);

			expect(actual).toEqual(expected);
		});

		test('should interpret the high bit of the leading byte as a sign', () => {
			const expected = [-1];
			const actual = new PackedBuffer([0xFF, 0xFF, 0xFF, 0xFF]).getLongs(1);

			expect(actual).toEqual(expected);
		});

		test('should read multiple sequential longs', () => {
			const expected = [300, 1];
			const actual = new PackedBuffer([0, 0, 1, 44, 0, 0, 0, 1]).getLongs(2);

			expect(actual).toEqual(expected);
		});

		test('should stop before an incomplete trailing group of bytes', () => {
			const expected = [300];
			const actual = new PackedBuffer([0, 0, 1, 44, 99]).getLongs(2);

			expect(actual).toEqual(expected);
		});

		test('should leave the index at the start of the unread trailing bytes', () => {
			const expected = 4;
			const buffer = new PackedBuffer([0, 0, 1, 44, 99]);
			buffer.getLongs(2);

			expect(buffer.index).toEqual(expected);
		});

		test('should return an empty array when fewer than 4 bytes remain', () => {
			const expected = [];
			const actual = new PackedBuffer([1, 2, 3]).getLongs(1);

			expect(actual).toEqual(expected);
		});

		test('should return `undefined` for an empty buffer', () => {
			const actual = new PackedBuffer([]).getLongs(1);

			expect(actual).toBeUndefined();
		});
	});

	describe('getLong', () => {
		test('should return a single long value', () => {
			const expected = 300;
			const actual = new PackedBuffer([0, 0, 1, 44]).getLong();

			expect(actual).toEqual(expected);
		});

		test('should return `undefined` when fewer than 4 bytes remain', () => {
			const actual = new PackedBuffer([1, 2, 3]).getLong();

			expect(actual).toBeUndefined();
		});
	});

	describe('getString', () => {
		test('should decode bytes as characters', () => {
			const expected = 'AB';
			const actual = new PackedBuffer([65, 66]).getString(2);

			expect(actual).toEqual(expected);
		});

		test('should advance the index by the number of bytes read', () => {
			const expected = 2;
			const buffer = new PackedBuffer([65, 66, 67]);
			buffer.getString(2);

			expect(buffer.index).toEqual(expected);
		});

		test('should return an empty string when no bytes remain', () => {
			const expected = '';
			const actual = new PackedBuffer([]).getString(2);

			expect(actual).toEqual(expected);
		});
	});

	describe('skip', () => {
		test('should advance the index without reading', () => {
			const expected = 2;
			const buffer = new PackedBuffer([10, 20, 30]);
			buffer.skip(2);

			expect(buffer.index).toEqual(expected);
		});

		test('should affect the next read', () => {
			const expected = 30;
			const buffer = new PackedBuffer([10, 20, 30]);
			buffer.skip(2);

			expect(buffer.getByte()).toEqual(expected);
		});
	});

	describe('cursor sharing across reads', () => {
		test('should advance a single shared index across mixed read calls', () => {
			// 'TZ' header, followed by a big-endian long (300), followed by a trailing byte
			const buffer = new PackedBuffer([84, 90, 0, 0, 1, 44, 7]);

			expect(buffer.getString(2)).toEqual('TZ');
			expect(buffer.getLong()).toEqual(300);
			expect(buffer.getByte()).toEqual(7);
			expect(buffer.index).toEqual(7);
		});
	});
});
