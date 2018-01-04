import curry from 'ramda/src/curry';
import compose from 'ramda/src/compose';
import merge from 'ramda/src/merge';
import classnames from 'classnames';

import {mergeClassNameMaps} from '../util';

import {addInternalProp} from './util';

// Joins two strings in a className-friendly way
const joinClasses = curry((a, b) => a + ' ' + b);

// Creates a function accepting two arguments. When both are truthy, calls fn with both. If either
// is falsey, returns the truthy one or the first if both are falsey.
const bothOrEither = curry((fn, a, b) => {
	if (a && b) {
		return fn(a, b);
	} else {
		return b || a;
	}
});

// Returns either the value for the property or the property name itself
const propOrSelf = curry((obj, prop) => obj && obj[prop] || prop);

// Takes a string (multiple classes can be space-delimited) and a css-modules object and resolves
// the class names to their css-modules name
const resolveClassNames = curry((css, className) => {
	if (css && className) {
		return className.split(' ').map(propOrSelf(css)).join(' ');
	}

	return className;
});

// Takes a styles config object and either resolves `className` with `css` or `className` iself
const localClassName = ({css, className}) => resolveClassNames(css, className) || '';

// Merges the locally-resolved className and the className from the props
const mergeClassName = (config, {className}) => {
	return bothOrEither(joinClasses, localClassName(config), className);
};

// Merges the local style object and the style object from the props
const mergeStyle = ({style: componentStyle}, {style: authorStyle}) => {
	return bothOrEither(merge, componentStyle, authorStyle);
};

/**
 * Creates the `join()` method of the styler
 *
 * @param {Object} cfg styles configuration object
 * @param {Object} props Render props
 * @returns {Function} `join()`
 * @method join
 */
const join = (cfg) => {
	if (cfg.css) {
		return compose(resolveClassNames(cfg.css), classnames);
	}

	return classnames;
};

/**
 * Creates the `append()` method of the styler
 *
 * @method append
 * @param {Object} props Render props updated by styles with `className` and `styler.join`
 * @returns {Function} `append()`
 */
const append = (props) => {
	const j = props.styler.join;
	return props.className ? compose(joinClasses(props.className), j) : j;
};

/**
 * Merges external and internal CSS classes and style objects. Internal CSS classes can be
 * optionally mapped to alternate names (e.g. those generated by CSS modules) by including a
 * `css` parameter.
 *
 * Example:
 * ```
 *	const stylesConfig = {
 *		css: {
 *			button: 'unambiguous-button-class-name',
 *			client: 'unambiguous-button-class-name-client'
 *		},
 *		className: 'button global-class',
 *		style: {
 *			color: 'red'
 *		}
 *	};
 *
 *	const props = {
 *		className: 'my-button',
 *		style: {
 *			display: 'none'
 *		}
 *	};
 *
 *	const renderStyles = styles(stylesConfig);
 *	const renderStyles(props); // {className: 'unambiguous-button-class-name global-class', styles: {color: 'red', display: 'none'}}
 * ```
 *
 * @method styles
 * @param   {Object}    cfg  Configuration object containing one of `css`, `className`,
 *                           `publicClassNames`, and/or `style`
 * @returns {Function}       Function that accepts a props object and mutates it to merge class
 *                           names and style objects and provide the `styler` utility function and
 *                           `css` merged class name map
 * @public
 */
const styles = (cfg, optProps) => {
	const prop = cfg.prop || 'className';
	let allowedClassNames = cfg.publicClassNames;

	if (cfg.css && allowedClassNames === true) {
		allowedClassNames = Object.keys(cfg.css);
	} else if (typeof allowedClassNames === 'string') {
		allowedClassNames = allowedClassNames.split(/\s+/);
	}

	const renderStyles = (props) => {
		let css = cfg.css;
		let config = cfg;

		const style = mergeStyle(cfg, props);
		if (style) {
			props.style = style;
		}

		// if the props includes a css map, merge them together now
		if (cfg.css && allowedClassNames && props.css) {
			css = mergeClassNameMaps(cfg.css, props.css, allowedClassNames);

			// merge the combined css map into config so it is used by other styler features
			config = {...cfg, css};
		}

		const className = mergeClassName(config, props);
		if (className) {
			props[prop] = className;
		}

		// styler and css should not be automatically spread onto children
		addInternalProp(props, 'css', css);
		addInternalProp(props, 'styler', {
			join: join(config)
		});

		// append requires the computed className property so it is built off the updated props rather
		// than the provided props
		props.styler.append = append(props);
		return props;
	};

	// maintain compatibility with 1.x
	if (optProps) {
		return renderStyles(optProps);
	}

	return renderStyles;
};

export default styles;
export {styles};
