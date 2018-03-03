/* eslint-disable no-unused-vars */
import arity from '../arity';
import clamp from '../clamp';
import compose from '../compose';
import curry from '../curry';

describe('arity', function () {
	it('should return the arity of a function', function () {
		expect(arity(function () {})).to.equal(0);
		expect(arity(function (a, b, c) {})).to.equal(3);
		expect(arity((a, b, c) => {})).to.equal(3);
	});

	it('should set the arity of a function', function () {
		let f1;

		f1 = function () {};
		arity(f1, 3);
		expect(arity(f1)).to.equal(3);

		f1 = function (a, b, c) {};
		arity(f1, 2);
		expect(arity(f1)).to.equal(2);

		f1 = (a, b, c) => {};
		arity(f1, 1);
		expect(arity(f1)).to.equal(1);
	});
});

describe('curry', function () {
	it('should set the original arity', function () {
		let f2;

		f2 = curry(function () {});
		expect(arity(f2)).to.equal(0);

		f2 = curry(function (a, b, c) {});
		expect(arity(f2)).to.equal(3);

		f2 = curry((a, b, c) => {});
		expect(arity(f2)).to.equal(3);

		f2 = curry(function (a, b, c, d, e, f, g, h, i, j) {});
		expect(arity(f2)).to.equal(10);
	});

	it('should update the arity', function () {
		let f2;

		f2 = curry(function () {});
		expect(arity(f2)).to.equal(0);

		f2 = curry(function (a, b, c) {});
		expect(arity(f2)).to.equal(3);

		f2 = f2(1);
		expect(arity(f2)).to.equal(2);

		f2 = f2(2);
		expect(arity(f2)).to.equal(1);

		f2 = curry((a, b, c) => {});
		expect(arity(f2)).to.equal(3);

		f2 = curry(function (a, b, c, d, e, f, g, h, i, j) {});
		expect(arity(f2)).to.equal(10);

		f2 = f2(1, 2, 3);
		expect(arity(f2)).to.equal(7);

		f2 = f2(4, 5, 6, 7, 8);
		expect(arity(f2)).to.equal(2);
	});

	it('should evaluate the function after all args', function () {
		let f2;

		f2 = curry(function () {
			return 1;
		});
		expect(f2()).to.equal(1);

		f2 = curry(function (a, b, c) {
			return a + b + c;
		});
		expect(f2(1, 2, 3)).to.equal(6);
		expect(f2(1)(2)(3)).to.equal(6);
		expect(f2(1, 2)(3)).to.equal(6);
		expect(f2(1)(2, 3)).to.equal(6);
		expect(f2()(1, 2)()(3)).to.equal(6);
	});
});

describe('clamp', function () {
	it('should be curried', function () {
		expect(arity(clamp)).to.equal(3);
		expect(arity(clamp(1))).to.equal(2);
		expect(arity(clamp(1, 2))).to.equal(1);
	});

	it('should clamp to lower bound', function () {
		expect(clamp(0, 5, -10)).to.equal(0);
		expect(clamp(-10, 10, -20)).to.equal(-10);
		expect(clamp(-Infinity, Infinity, -Infinity)).to.equal(-Infinity);
	});

	it('should clamp to upper bound', function () {
		expect(clamp(0, 5, 10)).to.equal(5);
		expect(clamp(-10, 10, 20)).to.equal(10);
		expect(clamp(-Infinity, Infinity, Infinity)).to.equal(Infinity);
	});

	it('should pass value when within bounds', function () {
		expect(clamp(0, 5, 2.5)).to.equal(2.5);
		expect(clamp(-10, 10, 0)).to.equal(0);
		expect(clamp(-Infinity, Infinity, Math.PI)).to.equal(Math.PI);
	});
});

describe('compose', function () {
	it('should return the arity of the last function', function () {
		let f3;

		f3 = compose(() => {}, function (a, b, c) {});
		expect(arity(f3)).to.equal(3);

		f3 = compose(function (a) {}, () => {});
		expect(arity(f3)).to.equal(0);
	});

	it('should pass the return value to the left', function () {
		let f3;
		function join (args) {
			return [1, ...args];
		}

		f3 = compose(join, join, join);

		expect(f3([])).to.deep.equal([1, 1, 1]);
		expect(f3([1, 2, 3])).to.deep.equal([1, 1, 1, 1, 2, 3]);
	});
});
