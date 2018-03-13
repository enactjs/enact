import arity from './arity';

function compose (...fn) {
	if (fn.length === 0) {
		throw new Error('compose expects at least one function');
	}

	const last = fn.pop();
	const lastArity = arity(last);

	const composed = function (...args) {
		const input = last(...args);
		return fn.reduceRight((result, f) => f(result), input);
	};

	return arity(composed, lastArity);
}

export default compose;
export {
	compose
};
