import clamp from 'ramda/src/clamp';
import {adaptEvent, forKey, forProp, forward, handle, oneOf, returnsTrue, stopImmediate} from '@enact/core/handle';
import {is} from '@enact/core/keymap';

const isNumber = (n) => typeof n === 'number' && !isNaN(n);

const calcStep = (knobStep, step) => {
	let s;

	if (isNumber(knobStep)) {
		s = knobStep;
	} else if (isNumber(knobStep)) {
		s = step;
	}

	// default to a step of 1 if neither are set or are set to 0
	// otherwise, increment/decrement would be no-ops
	return s || 1;
};

const calcPercent = (min, max, value) => {
	if (value <= min) {
		return 0;
	} else if (value >= max) {
		return 1;
	} else {
		return (value - min) / (max - min);
	}
};

const isIncrement = ({keyCode}, {orientation}) => {
	return orientation === 'vertical' ? is('up', keyCode) : is('right', keyCode);
};

const isDecrement = ({keyCode}, {orientation}) => {
	return orientation === 'vertical' ? is('down', keyCode) : is('left', keyCode);
};

const handleChange = (direction) => adaptEvent(
	(ev, {knobStep, max, min, step, value}) => ({
		value: clamp(min, max, value + (calcStep(knobStep, step) * direction)),
		proportion: calcPercent(min, max, value)
	}),
	forward('onChange')
);

const isActive = (ev, props) => {
	return props.active || props.activateOnFocus || props.detachedKnob;
};

const handleIncrement = handle(
	isActive,
	isIncrement,
	handleChange(1),
	stopImmediate
);

const handleDecrement = handle(
	isActive,
	isDecrement,
	handleChange(-1),
	stopImmediate
);

const either = (a, b) => (...args) => a(...args) || b(...args);
const atMinimum = (ev, {min, value}) => value <= min;
const atMaximum = (ev, {max, value}) => value >= max;
const forwardOnlyType = (type) => adaptEvent(() => ({type}), forward);

const forwardSpotlightEvents = returnsTrue(oneOf(
	[forKey('left'), handle(
		either(forProp('orientation', 'vertical'), atMinimum),
		forwardOnlyType('onSpotlightLeft')
	)],
	[forKey('right'), handle(
		either(forProp('orientation', 'vertical'), atMaximum),
		forwardOnlyType('onSpotlightRight')
	)],
	[forKey('down'), handle(
		either(forProp('orientation', 'horizontal'), atMinimum),
		forwardOnlyType('onSpotlightDown')
	)],
	[forKey('up'), handle(
		either(forProp('orientation', 'horizontal'), atMaximum),
		forwardOnlyType('onSpotlightUp')
	)],
));

export {
	calcPercent,
	calcStep,
	forwardSpotlightEvents,
	handleChange,
	handleDecrement,
	handleIncrement,
	isActive
};
