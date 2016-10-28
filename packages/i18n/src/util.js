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

	if (Array.isArray(str)) {
		return str.reduce((prev, curr) => {
			if(curr.props.children){
				return rtlPattern.test(curr.props.children) ? true : prev
			}
		}, false)
	}

	return false;
};

export {
	isRtlText
};
