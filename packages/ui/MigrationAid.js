/**
 * MigrationAid
 *
 * Just some utilities to make it easier to migrate components from Moonstone to UI.
 */


const diffClasses = function (name, componentClasses, combinedClasses) {
	console.group(name);	// eslint-disable-line no-console
	for (const key in componentClasses) {
		if (componentClasses[key] !== combinedClasses[key]) {
			console.log('Component: ' + key + ':', componentClasses[key]);	// eslint-disable-line no-console
			console.log(' Combined: ' + key + ':', combinedClasses[key]);	// eslint-disable-line no-console
		}
	}
	console.log('Original CombinedClasses:', combinedClasses);	// eslint-disable-line no-console
	console.groupEnd();	// eslint-disable-line no-console
};


export {
	diffClasses
};

