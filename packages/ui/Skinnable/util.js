import classnames from 'classnames';

const objectify = (arg) => {
	// undefined, null, empty string case
	// bail early
	if (!arg) return {};

	if (typeof arg === 'string') {
		// String case, convert to array for processing
		arg = arg.split(' ');
	}

	if (arg instanceof Array) {
		// Convert array values into object properties
		return arg.reduce((obj, a) => {
			obj[a] = true;
			return obj;
		}, {});
	} else if (typeof arg === 'object') {
		// Can just return objects as-is
		return arg;
	} else {
		// Invalid, return an empty object
		return {};
	}
};

const preferDefined = (a, b) => ((a != null) ? a : b);

/**
 * Determines the effective skin
 *
 * @param {String} defaultSkin The local default for this instance of useSkins
 * @param {String} authorSkin  The author-provided skin value
 * @param {String} parentSkin  The inherited skin value from an upstream useSkins
 * @private
 */
function determineSkin (defaultSkin, authorSkin, parentSkin) {
	return authorSkin || defaultSkin || parentSkin;
}

/**
 * Determines the effective skin variant
 *
 * @param {String|String[]} defaultVariants The local default variants for this instance
 * @param {String|String[]} allowedVariants The allowed variants for this instance
 * @param {String|String[]} authorVariants  The author-provided variants
 * @param {String|String[]} parentVariants  The inherited variants from an upstream useSkins
 * @private
 */
function determineVariants (defaultVariants, allowedVariants, authorVariants, parentVariants) {
	if (!allowedVariants || !(allowedVariants instanceof Array)) {
		// There are no allowed variants, so just return an empty object, indicating that there are no viable determined variants.
		return {};
	}

	defaultVariants = objectify(defaultVariants);
	authorVariants = objectify(authorVariants);
	parentVariants = objectify(parentVariants);

	// Merge all the variants objects, preferring values in objects from left to right.
	const mergedObj = [defaultVariants, parentVariants, authorVariants].reduce(
		(obj, a) => {
			if (a) {
				Object.keys(a).forEach(key => {
					obj[key] = preferDefined(a[key], obj[key]);
				});
			}

			return obj;
		},
		{}
	);

	// Clean up the merged object
	for (const key in mergedObj) {
		// Delete keys that are null or undefined and delete keys that aren't allowed
		if (mergedObj[key] == null || !allowedVariants.includes(key)) {
			delete mergedObj[key];
		}
	}

	return mergedObj;
}

function getClassName (skins, effectiveSkin, variants) {
	const skin = skins && skins[effectiveSkin];

	// only apply the skin class if it's set and different from the "current" skin as
	// defined by the value in context
	return classnames(skin, variants);
}


export {
	determineSkin,
	determineVariants,
	getClassName,
	objectify,
	preferDefined
};
