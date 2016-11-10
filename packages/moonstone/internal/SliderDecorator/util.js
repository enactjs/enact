const computeProportionLoaded = ({backgroundPercent}) => backgroundPercent / 100;
const computeProportionProgress = ({value, max}) => value / max;
const computePercentProgress = ({value, max}) => {
	const percentage = (value / max) * 100;
	return `${percentage}%`;
};
const computeBarTransform = (value, vertical) => `${vertical ? `scale(1, ${1 - (value || 0)})` : `scale(${value || 0}, 1)`} translateZ(0)`;
const computeKnobStyleProp = (vertical) => vertical ? 'bottom' : 'left';

export {
	computeProportionLoaded,
	computeProportionProgress,
	computePercentProgress,
	computeBarTransform,
	computeKnobStyleProp
};
