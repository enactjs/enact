const computeProportionBackground = ({backgroundPercent}) => backgroundPercent / 100;
const computeProportionProgress = ({value, max, min}) => (value - min) / (max - min);
const computeBarTransform = (proportion, vertical) => `${vertical ? `scale(1, ${proportion || 0})` : `scale(${proportion || 0}, 1)`} translateZ(0)`;
const computeKnobTransform = (proportion, vertical, node, knobRadius) => {
	if (node) {
		const knobDistance = (vertical ? (1 - proportion) * node.clientHeight : proportion * node.clientWidth) - knobRadius;
		return `${vertical ? `translate3d(-50%, ${knobDistance}px, 0)` : `translate3d(${knobDistance}px, -50%, 0)`}`;
	}
};

export {
	computeProportionBackground,
	computeProportionProgress,
	computeBarTransform,
	computeKnobTransform
};
