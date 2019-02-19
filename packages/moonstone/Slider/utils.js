import clamp from 'ramda/src/clamp';
import {adaptEvent, forKey, forProp, forward, handle, oneOf, preventDefault, stop} from '@enact/core/handle';
import {is} from '@enact/core/keymap';
import {calcProportion} from '@enact/ui/Slider/utils';

const calcStep = (knobStep, step) => {
	let s;

	if (knobStep != null) {
		s = knobStep;
	} else if (step != null) {
		s = step;
	}

	// default to a step of 1 if neither are set or are set to 0
	// otherwise, increment/decrement would be no-ops
	return s || 1;
};

const isIncrement = ({keyCode}, {orientation}) => {
	return orientation === 'vertical' ? is('up', keyCode) : is('right', keyCode);
};

const isDecrement = ({keyCode}, {orientation}) => {
	return orientation === 'vertical' ? is('down', keyCode) : is('left', keyCode);
};

const isNotMax = (ev, {value, max}) => {
	return value !== max;
};

const isNotMin = (ev, {min, value = min}) => {
	return value !== min;
};

const emitChange = (direction) =>  adaptEvent(
	(ev, {knobStep, max, min, step, value = min}) => {
		const newValue = clamp(min, max, value + (calcStep(knobStep, step) * direction));

		return {
			value: newValue,
			proportion: calcProportion(min, max, newValue),
			type: 'onChange'
		};
	},
	forward('onChange')
);

const isActive = (ev, props) => {
	return props.active || props.activateOnFocus;
};

const handleIncrement = handle(
	isActive,
	isIncrement,
	preventDefault,
	stop,
	isNotMax,
	emitChange(1)
);

const handleDecrement = handle(
	isActive,
	isDecrement,
	preventDefault,
	stop,
	isNotMin,
	emitChange(-1)
);

const either = (a, b) => (...args) => a(...args) || b(...args);
const atMinimum = (ev, {min, value = min}) => value <= min;
const atMaximum = (ev, {max, min, value = min}) => value >= max;
const forwardOnlyType = (type) => adaptEvent(() => ({type}), forward(type));

const forwardSpotlightEvents = oneOf(
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
);

export {
	forwardSpotlightEvents,
	emitChange,
	handleDecrement,
	handleIncrement
};
