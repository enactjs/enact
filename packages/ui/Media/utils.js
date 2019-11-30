import React from 'react';

/**
 * Generates a key representing the source node or nodes provided
 *
 * Example:
 * ```
 * getKeyFromSource('path/file.mp4'); // 'path/file.mp4'
 * getKeyFromSource(
 * 	<source src="path/file.mp4" type="video/mp4" />
 * ); // 'path/file.mp4'
 * getKeyFromSource([
 * 	<source src="path/file.mp4" type="video/mp4" />,
 * 	<source src="path/file.ogg" type="video/ogg" />,
 * ]); // 'path/file.mp4+path/file.ogg'
 * ```
 *
 * @function
 * @param   {String|Element|Element[]} source URI for a source, `<source>` node, or array of
 *                                     `<source>` nodes
 * @returns {String}                   Key representing sources
 * @memberof ui/Media
 * @public
 */
const getKeyFromSource = (source = '') => {
	if (React.isValidElement(source)) {
		return React.Children.toArray(source)
			.filter(s => !!s)
			.map(s => s.props.src)
			.join('+');
	}

	return String(source);
};

export {
	getKeyFromSource
};
