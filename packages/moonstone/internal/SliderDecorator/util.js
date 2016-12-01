const computeProportionBackground = ({backgroundPercent}) => backgroundPercent / 100;
const computeProportionProgress = ({value, max, min}) => (value - min) / (max - min);
const computeBarTransform = (proportion = 0, vertical) => {
	const scaleStyle = vertical ? `scale(1, ${proportion})` : `scale(${proportion}, 1)`;
	return `${scaleStyle} translateZ(0)`;
};
const computeKnobTransform = (proportion, vertical, node, knobRadius) => {
	if (node) {
		if (vertical) {
			return `translate3d(-50%, ${(1 - proportion) * node.clientHeight - knobRadius}px, 0)`;
		} else {
			return `translate3d(${proportion * node.clientWidth - knobRadius}px, -50%, 0)`;
		}
	}
};

export {
	computeProportionBackground,
	computeProportionProgress,
	computeBarTransform,
	computeKnobTransform
};
