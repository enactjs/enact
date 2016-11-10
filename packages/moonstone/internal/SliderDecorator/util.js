const computeLoadedValue = ({backgroundPercent}) => `${backgroundPercent}%`;
const computePercentProgress = ({value, max}) => {
	const percentage = (value / max) * 100;
	return `${percentage}%`;
};
const computeLoaderStyleProp = (vertical) => vertical ? 'height' : 'width';
const computeFillStyleProp = (vertical) => vertical ? 'height' : 'width';
const computeKnobStyleProp = (vertical) => vertical ? 'top' : 'left';

export {
	computeLoadedValue,
	computePercentProgress,
	computeLoaderStyleProp,
	computeFillStyleProp,
	computeKnobStyleProp
};
