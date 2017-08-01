// State management functions
const activate = ({active}) => active !== 2 ? {active: 2} : null;
const deactivate = ({active}) => active !== 0 ? {active: 0} : null;
const pause = ({active}) => active !== 1 ? {active: 1} : null;

export {
	activate,
	deactivate,
	pause
};
