const merge = (components, field) => {
	return Object.assign({}, ...components.map(c => c[field]));
};

const mergeComponentMetadata = (displayName, ...components) => {
	const fn = function () {};
	fn.displayName = displayName;
	fn.groupId = displayName;
	fn.propTypes = merge(components, 'propTypes');
	fn.defaultProps = merge(components, 'defaultProps');

	return fn;
};

const removeProps = (component, props) => {
	if (typeof props === 'string') {
		props = props.split(' ');
	}

	props.forEach(prop => {
		delete component.propTypes[prop];	// eslint-disable-line react/forbid-foreign-prop-types
		delete component.defaultProps[prop];
	});
};

export {
	mergeComponentMetadata,
	removeProps
};
