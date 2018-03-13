import clamp from '@enact/core/internal/fp/clamp';

const computeProportionProgress = ({value, max, min}) => (value - min) / (max - min);
const computeBarTransform = (_proportion = 0, vertical) => {
	const proportion = clamp(0, 1, _proportion);
	const scaleStyle = vertical ? `scale(1, ${proportion})` : `scale(${proportion}, 1)`;
	return `${scaleStyle} translateZ(0)`;
};
const computeKnobTransform = (_proportion, vertical, node) => {
	const proportion = clamp(0, 1, _proportion);
	if (node) {
		if (vertical) {
			return `translate3d(0, ${(1 - proportion) * node.clientHeight}px, 0)`;
		} else {
			return `translate3d(${proportion * node.clientWidth}px, 0, 0)`;
		}
	}
};

const parseNumber = (value) => {
	const parseFn = (value % 1 !== 0) ? parseFloat : parseInt;
	return parseFn(value);
};

const getDecimalDigits = (value) => (value % 1 !== 0) ? (value + '').split('.')[1].length : 0;

export {
	computeProportionProgress,
	computeBarTransform,
	computeKnobTransform,
	getDecimalDigits,
	parseNumber
};
