import clamp from 'ramda/src/clamp';
import {handle, stopImmediate} from '@enact/core/handle';
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

const handleChange = (direction) => (ev, {knobStep, max, min, onChange, step, value}) => {
	onChange({
		value: clamp(min, max, value + (calcStep(knobStep, step) * direction))
	});

	return true;
};

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

export {
	calcPercent,
	calcStep,
	handleChange,
	handleDecrement,
	handleIncrement,
	isActive,
	toggleActive
};
