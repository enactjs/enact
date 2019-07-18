import LS2Request from "../LS2Request";

describe('LS2Request', () => {
	const nop = () => {};

	describe('callback', () => {
		const invalidResponse = '{invalid: json';
		const failedResponse = '{"errorCode": 101}';
		const successfulResponse = '{"returnValue": true}';

		it ('should return an error for a null msg', () => {
			const request = new LS2Request();
			const onFailure = jest.fn();

			request.callback(nop, onFailure, nop, null);

			const expected = {errorCode: -1};
			const actual = onFailure.mock.calls[0][0];

			expect(actual).toMatchObject(expected);
		});

		it ('should return an error for invalid JSON', () => {
			const request = new LS2Request();
			const onFailure = jest.fn();

			request.callback(nop, onFailure, nop, );

			const expected = {errorCode: -1};
			const actual = onFailure.mock.calls[0][0];

			expect(actual).toMatchObject(expected);
		});

		it ('should invoke onFailure for a valid, failed request', () => {
			const request = new LS2Request();
			const onFailure = jest.fn();

			request.callback(nop, onFailure, nop, failedResponse);

			const expected = {errorCode: 101};
			const actual = onFailure.mock.calls[0][0];

			expect(actual).toMatchObject(expected);
		});

		it ('should invoke onSuccess for a valid request', () => {
			const request = new LS2Request();
			const onSuccess = jest.fn();

			request.callback(onSuccess, nop, nop, successfulResponse);

			const expected = {returnValue: true};
			const actual = onSuccess.mock.calls[0][0];

			expect(actual).toMatchObject(expected);
		});

		it ('should invoke onComplete for a valid request', () => {
			const request = new LS2Request();
			const onComplete = jest.fn();

			request.callback(nop, nop, onComplete, successfulResponse);

			const expected = {returnValue: true};
			const actual = onComplete.mock.calls[0][0];

			expect(actual).toMatchObject(expected);
		});

		it ('should invoke onComplete for an invalid request', () => {
			const request = new LS2Request();
			const onComplete = jest.fn();

			request.callback(nop, nop, onComplete, invalidResponse);

			const expected = {errorCode: -1};
			const actual = onComplete.mock.calls[0][0];

			expect(actual).toMatchObject(expected);
		});

		it ('should invoke onComplete for a valid, failed request', () => {
			const request = new LS2Request();
			const onComplete = jest.fn();

			request.callback(nop, nop, onComplete, failedResponse);

			const expected = {errorCode: 101};
			const actual = onComplete.mock.calls[0][0];

			expect(actual).toMatchObject(expected);
		});
	});
});
