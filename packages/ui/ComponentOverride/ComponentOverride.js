import React from 'react';

const ComponentOverride = ({component, ...props}) => component ? (
	typeof component === 'function' && React.createElement(component, props) ||
	React.isValidElement(component) && React.cloneElement(component, props)
) : null;

export default ComponentOverride;
export {
	ComponentOverride
};
