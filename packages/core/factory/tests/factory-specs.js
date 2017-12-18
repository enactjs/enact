import sinon from 'sinon';
import factory from '../factory';

describe('factory', () => {

	it('should allow omitting the component config', function () {
		const fn = sinon.spy();
		const fnFactory = factory(fn);
		fnFactory();

		const expected = true;
		const actual = fn.calledOnce;

		expect(actual).to.equal(expected);
	});

	it('should pass through author config when omitting the component config', function () {
		const fn = sinon.spy();
		const config = {
			css: {
				button: 'author-button',
				inner: 'author-inner'
			}
		};
		const fnFactory = factory(fn);
		fnFactory(config);

		const expected = config;
		const actual = fn.firstCall.args[0];

		expect(actual).to.deep.equal(expected);
	});

	it('should only pass supported keys to function', function () {
		const fn = sinon.spy();
		const config = {
			unsupportedKey: true
		};
		const fnFactory = factory(fn);
		fnFactory(config);

		const expected = 'unsupportedKey';
		const actual = Object.keys(fn.firstCall.args[0]);

		expect(actual).to.not.contain(expected);
	});

});
