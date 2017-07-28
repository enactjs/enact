// State management functions
const activate = ({active}) => active ? null : {active: true};
const deactivate = ({active}) => active ? {active: false} : null;

export {
	activate,
	deactivate
};
