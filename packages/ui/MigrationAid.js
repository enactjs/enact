/**
 * MigrationAid
 *
 * Just some utilities to make it easier to migrate components from Moonstone to UI.
 */


const diffClasses = function (name, componentClasses, combinedClasses) {
	console.group(name);
	for (const key in componentClasses) {
		if (componentClasses[key] !== combinedClasses[key]) {
			console.log('Component: ' + key + ':', componentClasses[key]);
			console.log(' Combined: ' + key + ':', combinedClasses[key]);
		}
	}
	console.log('Original CombinedClasses:', combinedClasses);
	console.groupEnd();
};


export {
	diffClasses
};

