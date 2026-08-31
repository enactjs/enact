import PropTypes from 'prop-types';
import {createContext} from 'react';

interface RouteContextValue {
	navigate: (props: {path: string}) => void;
	path: string | string[];
}

const RouteContext = createContext<RouteContextValue | null>(null);

const toSegments = (path: string | string[]): string[] => Array.isArray(path) ? path : (path || '').split('/').filter(Boolean);

const getPaths = (routes: Record<string, any>, base: string): string[] => {
	let result: string[] = [];
	Object.keys(routes).filter(s => s[0] !== '$').forEach(p => {
		const path = base + '/' + p;
		result.push(path);
		result = result.concat(getPaths(routes[p], path));
	});

	return result;
};

const stringifyRoutes = (routes: Record<string, any>): string => {
	const pad = '\n\t';
	const paths = getPaths(routes, '');
	return pad + paths.join(pad);
};

// resolves path relative to base
const resolve = (base: string | string[] = '/', path: string): string | undefined => {
	// We could resolve to base but we want to consider this an error condition
	if (!path) return;

	// convert a base array to a string for simpler normalization
	let baseStr: string = base instanceof Array ? base.join('/') : base;

	// normalize base to have a leading slash
	if (!baseStr.startsWith('/')) baseStr = '/' + baseStr;

	// if path has a leading slash, it's an absolute path so return it
	if (path.startsWith('/')) return path;

	// if path isn't absolute and doesn't begin with ., it's relative to the base
	if (!path.startsWith('.')) return baseStr + '/' + path;

	// convert to arrays remove empty paths from base
	let baseSegments = baseStr.split('/').filter(Boolean);
	let pathSegments = path.split('/');

	while (pathSegments.length > 0) {
		const p = pathSegments.shift();
		if (!p || p === '.') {
			// if we have an empty path or a current directory path, continue
			continue;
		} else if (p === '..') {
			// if we're down the root and we encounter a parent path, return
			if (baseSegments.length === 0) return;
			// otherwise, remove a level from base
			baseSegments.pop();
		} else {
			// put back the current element so it can be included in the output path
			pathSegments.unshift(p);
			break;
		}
	}

	// finally rebuild the path including the segment we just shifted
	return `/${baseSegments.concat(pathSegments).join('/')}`;
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
export type {RouteContextValue};
