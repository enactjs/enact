import clamp from 'ramda/src/clamp';
import {forKey, forProp, forward, handle, stopImmediate} from '@enact/core/handle';
import {is} from '@enact/core/keymap';

const validateStep = (step) => typeof step === 'number' && step || 0;

const calcStep = (steps) => steps.map(validateStep).reduce((acc, v) => acc || v) || 1;

const calcPercent = (min, max, value) => {
	if (value <= min) {
		return 0;
	} else if (value >= max) {
		return 1;
	} else {
		return (value - min) / (max - min);
	}
};

const toggleActive = handle(
	forKey('enter'),
	forward('onActivate')
);

const isIncrement = ({keyCode}, {orientation}) => {
	return orientation === 'vertical' ? is('up', keyCode) : is('right', keyCode);
};

const isDecrement = ({keyCode}, {orientation}) => {
	return orientation === 'vertical' ? is('down', keyCode) : is('left', keyCode);
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
