import PropTypes from 'prop-types';

const toSegments = (path) => Array.isArray(path) ? path : path.split('/').slice(1);

const getPaths = (routes, base) => {
	let result = [];
	Object.keys(routes).filter(s => s[0] !== '$').forEach(p => {
		const path = base + '/' + p;
		result.push(path);
		result = result.concat(getPaths(routes[p], path));
	});

	return result;
};

const stringifyRoutes = (routes) => {
	const pad = '\n\t';
	const paths = getPaths(routes, '');
	return pad + paths.join(pad);
};

const propTypes = {
	path: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.string),	// array of path segments
		PropTypes.string						// URI-style path
	])
};

export {
	propTypes,
	stringifyRoutes,
	toSegments
};
