import React from 'react';

const merge = (components, field) => {
	return Object.assign({}, ...components.map(c => c[field]));
};

const mergeComponentMetadata = (displayName, ...components) => {
	const Component = components[components.length - 1];
	const fn = function (props) {
		return <Component {...props} />;
	};

	fn.displayName = displayName;
	fn.propTypes = merge(components, 'propTypes');
	fn.defaultProps = merge(components, 'defaultProps');

	return fn;
};

const removeProps = (component, props) => {
	if (typeof props === 'string') {
		props = props.split(' ');
	}

	props.forEach(prop => {
		delete component.propTypes[prop];
		delete component.defaultProps[prop];
	});
};

export {
	mergeComponentMetadata,
	removeProps
};
