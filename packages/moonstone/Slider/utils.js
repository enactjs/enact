import clamp from 'ramda/src/clamp';
import {forKey, forProp, forward, handle, stopImmediate} from '@enact/core/handle';
import {is} from '@enact/core/keymap';

const validateStep = (step) => typeof step === 'number' && step || 0;

const calcStep = (steps) => steps.map(validateStep).reduce((acc, v) => acc || v) || 1;

const calcPercent = (min, max, value) => (value - min) / (max - min);

const toggleActive = handle(
	forKey('enter'),
	forward('onActivate')
);

const isIncrement = ({keyCode}, {vertical}) => {
	return vertical ? is('up', keyCode) : is('right', keyCode);
};

const isDecrement = ({keyCode}, {vertical}) => {
	return vertical ? is('down', keyCode) : is('left', keyCode);
};

const handleChange = (direction) => (ev, {knobStep, max, min, onChange, step, value}) => {
	const amount = calcStep([knobStep, step]) || 1;
	onChange({
		value: clamp(min, max, value + (amount * direction))
	});

	return true;
};

const isActive = forProp('active', true);

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
