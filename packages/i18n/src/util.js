import React from 'react';

/**
* This regex pattern is used by the [isRtlText()]{@link i18n/utils.isRtlText} function.
*
* Arabic: \u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFE
* Hebrew: \u0590-\u05FF\uFB1D-\uFB4F
*
* @private
*/
const rtlPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFE\u0590-\u05FF\uFB1D-\uFB4F]/;

/**
* Takes content `str` and determines whether or not it is [RTL]{@glossary RTL}.
*
* @param {String} str - A [String]{@glossary String} to check the [RTL]{@glossary RTL}-ness of.
* @returns {Boolean} `true` if `str` should be RTL; `false` if not.
* @public
*/
const isRtlText = function (str) {
	if (typeof str === 'string') {
		return rtlPattern.test(str);
	}

	return false;
};

/**
* Takes a React Element as an input. Performs a BFS to traverse the tree and
* find if any child uses RTLText.
*
* @param {Object}
* @returns {Boolean} `true` if the element contains RTL text; `false` if not.
* @private
*/
const traverseToFindRtl = (obj) => {
	let currentObj = obj;

	while (currentObj.props.children) {
		if (typeof currentObj.props.children === 'object'){
			const childrenArray = React.Children.toArray(currentObj.props.children);

			for (let i = 0; i < childrenArray.length; i++) {
				const child = childrenArray[i];
				if(child.props.children){
					currentObj = child;
				}
			}

		} else {
			return isRtlText(currentObj.props.children);
		}
	}

};

/**
* Takes in a React Components children and goes through each to find RTL Text
*
* @param {Object | Array}
* @returns {Boolean} `true` if the element contains RTL text; `false` if not.
* @public
*/
const findRtlText = function (children) {
	if(typeof children === 'string'){
		return isRtlText(children);
	}

	if(typeof children === 'object'){
		const childrenArray = React.Children.toArray(children);

		return childrenArray.reduce((prev, curr) => {
			if (React.isValidElement(curr)){
				return traverseToFindRtl(curr) ? true : prev;
			}
		}, false);
	}

	return false;
};

export {
	findRtlText,
	isRtlText
};
