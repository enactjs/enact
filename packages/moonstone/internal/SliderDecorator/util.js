const computeProportionLoaded = ({backgroundPercent}) => backgroundPercent / 100;
const computeProportionProgress = ({value, max}) => value / max;
const computeBarTransform = (value, vertical) => `${vertical ? `scale(1, ${1 - (value || 0)})` : `scale(${value || 0}, 1)`} translateZ(0)`;
const computeKnobTransform = (value, vertical, knobRadius) => `${vertical ? `translate3d(50%, ${value - knobRadius}px, 0)` : `translate3d(${value - knobRadius}px, -50%, 0)`}`;

export {
	computeProportionLoaded,
	computeProportionProgress,
	computeBarTransform,
	computeKnobTransform
};
