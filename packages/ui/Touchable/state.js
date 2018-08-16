const States = {
	Inactive: 0,
	Paused: 1,
	Active: 2
};

const setActive = (state) => ({active}) => active !== state ? {active: state} : null;

// State management functions
const activate = setActive(States.Active);
const deactivate = setActive(States.Inactive);
const pause = ({active}) => active === States.Active ? {active: States.Paused} : null;

export {
	activate,
	deactivate,
	pause,
	States
};
