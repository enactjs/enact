import curry3 from './curry3';

function _clamp (min, max, value) {
	if (__DEV__) {
		let type = typeof min;
		if (type !== 'number') {
			throw new Error(`clamp expects min to be a number. Received ${type} instead`);
		}

		type = typeof max;
		if (type !== 'number') {
			throw new Error(`clamp expects max to be a number. Received ${type} instead`);
		}

		type = typeof value;
		if (type !== 'number') {
			throw new Error(`clamp expects value to be a number. Received ${type} instead`);
		}
	}

	if (min > max) {
		throw new Error('min must be less than or equal max in clamp(min, max, value)');
	}

	if (value < min) {
		return min;
	} else if (value > max) {
		return max;
	}

	return value;
}

const clamp = curry3(_clamp);

export default clamp;
export {
	clamp
};
