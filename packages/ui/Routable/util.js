import PropTypes from 'prop-types';
import React from 'react';

const RouteContext = React.createContext(null);

const toSegments = (path) => Array.isArray(path) ? path : path.split('/').filter(Boolean);

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

// resolves path relative to base
const resolve = (base = '/', path) => {
	// We could resolve to base but we want to consider this an error condition
	if (!path) return;

	// convert a base array to a string for simpler normalization
	if (base instanceof Array) base = base.join('/');

	// normalize base to have a leading slash
	if (!base.startsWith('/')) base = '/' + base;

	// if path has a leading slash, it's an absolute path so return it
	if (path.startsWith('/')) return path;

	// if path isn't absolute and doesn't begin with ., it's relative to the base
	if (!path.startsWith('.')) return base + '/' + path;

	// convert to arrays remove empty paths from base
	base = base.split('/').filter(Boolean);
	path = path.split('/');

	while (path.length > 0) {
		const p = path.shift();
		if (!p || p === '.') {
			// if we have an empty path or a current directory path, continue
			continue;
		} else if (p === '..') {
			// if we're down the root and we encounter a parent path, return
			if (base.length === 0) return;
			// otherwise, remove a level from base
			base.pop();
		} else {
			// put back the current element so it can be included in the output path
			path.unshift(p);
			break;
		}
	}

	// finally rebuild the path including the segment we just shifted
	return `/${base.concat(path).join('/')}`;
};

const RoutablePropTypes = {
	path: PropTypes.oneOfType([
		PropTypes.arrayOf(PropTypes.string),	// array of path segments
		PropTypes.string						// URI-style path
	])
};

export {
	RoutablePropTypes,
	resolve,
	stringifyRoutes,
	toSegments,
	RouteContext
};
