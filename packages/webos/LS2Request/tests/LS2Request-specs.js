import LS2Request from "../LS2Request";

describe('LS2Request', () => {
	const nop = () => {};

	describe('callback', () => {
		it ('should return an error for a null msg', () => {
			const request = new LS2Request();
			const onError = jest.fn();

			request.callback(nop, onError, nop, null);

			const expected = {errorCode: -1};
			const actual = onError.mock.calls[0][0];

			expect(actual).toMatchObject(expected);
		});
	});
});
