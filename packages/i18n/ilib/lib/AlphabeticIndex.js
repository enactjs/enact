/*
 * AlphabeticIndex.js - Represent an alphabetic index
 *
 * Copyright © 2017-2018, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* !depends
ilib.js
Utils.js
Locale.js
LocaleInfo.js
NormString.js
CType.js
IString.js
isIdeo.js
isAscii.js
isDigit.js
Collator.js
NormString.js
*/

var ilib = require("./ilib.js");
var Utils = require("./Utils.js");
var Locale = require("./Locale.js");
var LocaleInfo = require("./LocaleInfo.js");
var CType = require("./CType.js");
var IString = require("./IString.js");
var isIdeo = require("./isIdeo.js");
var isAscii = require("./isAscii.js");
var isDigit = require("./isDigit.js");
var Collator = require("./Collator.js");
var NormString = require("./NormString.js");


/**
 * @class Create a new alphabetic index instance.
 *
 * This class handles alphabetic indexes which are collated sequences of
 * buckets into which elements are placed, sorted appropriate to the given
 * language. An example would be an index of person names in a contact
 * list, organized by the first letter of the family name.<p>
 *
 * Example in English:
 * Buckets: A B C D E F G H I J K L M N O P Q R S T U V W X Y Z #<p>
 *
 * <code>
 * A
 *    Adams
 *    Albers
 *    Alvarez
 * B
 *    Baker
 *    Banerjee
 *    Brunshteyn
 * ...
 * </code>
 *
 * This class can give you the sorted list of labels to show in the UI. It can
 * also organize a list of string elements into buckets for each
 * label so that you can display the correctly sorted elements. This depends
 * on the {@link Collator} class to perform the sorting/collation.<p>
 *
 * The class also supports having buckets for strings before the first (underflow)
 * and after the last (overflow) bucket. <p>
 *
 * If you have a lot of characters that are not commonly used in the current
 * locale, you can add more labels for those characters as well. Elements will
 * match those buckets only if they have the same first character as the
 * bucket label.<p>
 *
 * The options object may contain any (or none) of the following properties:
 *
 * <ul>
 * <li><i>locale</i> - locale or localeSpec to use to parse the address. If not
 * specified, this function will use the current ilib locale
 *
 * <i><i>style</i> - the style of collation to use for this index.
 * For some locales, there are different styles of collating strings depending
 * on what kind of strings are being collated or what the preference of the user
 * is. For example, in German, there is a phonebook order and a dictionary ordering
 * that sort the same array of strings slightly differently. The static method
 * {@link Collator#getAvailableStyles} will return a list of collation styles that ilib
 * currently knows about for any given locale. If the value of the style option is
 * not recognized for a locale, it will be ignored. Default style is "standard".
 *
 * <li><i>overflowLabel</i> - the label to use for the overflow bucket.
 * Default: "#"
 *
 * <li><i>underflowLabel</i> - the label to use for the underflow bucket.
 * Default: "*"
 *
 * <li><i>onLoad</i> - a callback function to call when the address info for the
 * locale is fully loaded and the index is ready to be used. When the onLoad
 * option is given, the alphabetic index object
 * will attempt to load any missing locale data using the ilib loader callback.
 * When the constructor is done (even if the data is already preassembled), the
 * onLoad function is called with the current instance as a parameter, so this
 * callback can be used with preassembled or dynamic loading or a mix of the two.
 *
 * <li><i>sync</i> - tell whether to load any missing locale data synchronously or
 * asynchronously. If this option is given as "false", then the "onLoad"
 * callback must be given, as the instance returned from this constructor will
 * not be usable for a while.
 *
 * <li><i>loadParams</i> - an object containing parameters to pass to the
 * loader callback function when locale data is missing. The parameters are not
 * interpretted or modified in any way. They are simply passed along. The object
 * may contain any property/value pairs as long as the calling code is in
 * agreement with the loader callback function as to what those parameters mean.
 * </ul>
 *
 * @constructor
 * @param {Object} options options to the parser
 */
var AlphabeticIndex = function (options) {
    this.sync = true;
    this.loadParams = {};
    this.caseSensitive = false;
    this.accentSensitive = false;
    this.overflowLabel = "#";
    this.underflowLabel = "*";
    this.style = "standard";
    this.index = [];

    if (options) {
        if (options.locale) {
            this.locale = (typeof(options.locale) === 'string') ? new Locale(options.locale) : options.locale;
        }

        if (typeof(options.style) !== 'undefined') {
            this.style = options.style;
        }

        if (typeof(options.overflowLabel) !== 'undefined') {
            this.overflowLabel = options.overflowLabel;
        }

        if (typeof(options.underflowLabel) !== 'undefined') {
            this.underflowLabel = options.underflowLabel;
        }

        if (typeof(options.sync) !== 'undefined') {
            this.sync = (options.sync == true);
        }
        if (options.loadParams) {
            this.loadParams = options.loadParams;
        }
    }

    this.locale = this.locale || new Locale();

    isAscii._init(this.sync, this.loadParams, ilib.bind(this, function() {
        isIdeo._init(this.sync, this.loadParams, ilib.bind(this, function(){
            isDigit._init(this.sync, this.loadParams, ilib.bind(this, function(){
                NormString.init({
                    sync: this.sync,
                    loadParam: this.loadParams,
                    onLoad: ilib.bind(this, function() {
                        new Collator ({
                            locale: this.locale,
                            useNative: false,
                            sensitivity: "primary",
                            usage: "search",
                            sync: this.sync,
                            loadParam : this.loadParams,
                            onLoad: ilib.bind(this, function(collation) {
                                this.collationObj = collation;
                                this._init();
                                if (options && typeof(options.onLoad) === 'function') {
                                    options.onLoad(this);
                                }
                            })
                        });
                    })
                })
            }));
        }));
    }));
};

/**
 * @private
 */
AlphabeticIndex.prototype._updateCollationMap = function() {
    this.mixedCollationMap = new Array();

    // we just loaded it, so it should already be in the cache,
    // so we can always do sync=true
    Utils.loadData({
        object: "Collator",
        locale: this.locale,
        name: "collation.json",
        sync: true,
        loadParams: this.loadParams,
        callback: ilib.bind(this, function (collations) {
            for (var i=0; i < this.inherit.length; i++) {
                var collationData = {};

                if (this.inherit[i] === "this") {
                    collationData.style = this.style;
                    collationData.flowBoundaries = this.flowBoundaries;
                    collationData.indexUnits = this.indexUnits
                    collationData.map = this.collationMap;
                    this.mixedCollationMap.push(collationData);
                } else {
                    collationData.style = this.inherit[i];
                    collationData.flowBoundaries = collations[this.inherit[i]].flowBoundaries;
                    collationData.indexUnits = collations[this.inherit[i]].indexUnits;
                    collationData.map = collations[this.inherit[i]].map;
                    this.mixedCollationMap.push(collationData);
                }
            }
        })
    });
}
/**
 * @private
 */
AlphabeticIndex.prototype._init = function() {

    this.flowBoundaries = new Array();

    if (this.style === 'standard') {
        this.style = this.collationObj.defaultRule;
    }

    this.collationMap = this.collationObj.collation.map;
    this.flowBoundaries = this.collationObj.collation.flowBoundaries;
    this.indexUnits = this.collationObj.collation.indexUnits;

    this.inherit = this.collationObj.collation.inherit;

    if (this.inherit !== undefined) {
        this._updateCollationMap();
    }
}

/**
 * @private
 */
AlphabeticIndex.prototype._getKeyByValue = function(value, validMapNum) {
    var i,label;

    if (!value || (!ilib.isArray(value))) {
        return "";
    }

    if (this.inherit) {
        if (validMapNum > -1) {
            this.collationMap = this.mixedCollationMap[validMapNum].map;
            this.indexUnits = this.mixedCollationMap[validMapNum].indexUnits;
        }
    }

    for (i=0; i < this.indexUnits.length; i++) {
        if (this.collationMap[this.indexUnits[i]][0]
            === value[0]) {
            label = this.indexUnits[i];
            break;
        }
    }

    return label;
};

/**
 * @private
 */
AlphabeticIndex.prototype._getFirstChar = function(element) {
    if (!element) {
        return "";
    }
    var firstChar, normString, it;
    var source = new NormString(element);

    normString = source.normalize("nfc");
    it = normString.charIterator();
    firstChar = it.next();

    if (CType.withinRange(firstChar, "hangul")) {
        normString = source.normalize("nfkd");
        it = normString.charIterator();
        firstChar = it.next();
    }
    return firstChar;
};

/**
 * @private
 */
AlphabeticIndex.prototype._getLabelIndex = function(label) {
    if (!label) {
        return undefined;
    }

    var i, indexNum;

    for (i=0; i < this.index.length; i++) {
        if (this.index[i].label === label) {
            indexNum = i;
            break;
        }
    }
    return indexNum;
};

/**
 * Return the locale used with this instance.
 * @return {Locale} the Locale instance for this index
 */
AlphabeticIndex.prototype.getLocale = function() {
    return this.locale;
};

/**
 * Add an element to the index. The element is added to the
 * appropriate bucket and sorted within that bucket according
 * to the collation for the locale set up within this index.
 *
 * @param {string|undefined} element the element to add
 * @returns {string|undefined} the label of the bucket into which
 * this element was added
 */
AlphabeticIndex.prototype.addElement = function(element) {
    if (typeof(element) !== 'string') {
        return undefined;
    }

    var i;
    var label = this.getBucket(element);
    var newItem = true;
    var itemSet = {};

    itemSet.label = label;
    itemSet.elements = [];

    for (i = 0; i < this.index.length; i++) {
        if (this.index[i].label === label) {
            if (this.index[i].elements.indexOf(element) === -1) {
                this.index[i].elements.push(element);
            }
            newItem = false;
            break;
        }
    }

    if (newItem) {
        itemSet.elements.push(element);
        this.index.push(itemSet);
    }

    return label;
};

/**
 * Add labels to this index for characters that are not
 * commonly used in the current locale. These are added
 * into the list of bucket labels at the given start
 * index. If start is not given, or is not within the
 * range of 0 (the overflow bucket) to N (the underflow
 * bucket), then the default position is at the end of
 * the list right before the underflow bucket.
 *
 * @param {Array.<String>} labels array of labels to add
 * in the order you would like to see them returned
 * @param {number=} start the position in the bucket
 * labels list to add these new labels
 */
AlphabeticIndex.prototype.addLabels = function(labels, start) {
    var allBucketLabels = [];

    if (!labels && !ilib.isArray(labels)) {
        return;
    }

    allBucketLabels = this.getAllBucketLabels();

    if (!start ||
        start > allBucketLabels.length) {
        allBucketLabels = allBucketLabels.concat(labels);

    } else {
        if (typeof labels === 'string') {
            allBucketLabels.splice(start, 0, labels);
        } else if (typeof labels === 'object') {
            for (var j = labels.length-1; j >= 0; j--) {
                allBucketLabels.splice(start, 0, labels[j]);
            }

        }
    }
    this.allBucketLabels = allBucketLabels;
};

/**
 * Clear all elements from the buckets. This index can be
 * reused for a new batch of elements by clearing it
 * first.
 */
AlphabeticIndex.prototype.clear = function() {
    for (var prop in this.index) {
        if (this.index.hasOwnProperty(prop)){
            this.index[prop] = "";
        }
    }
};

/**
 * Return a javascript hash containing all elements in
 * the index. The hash has a property for each bucket,
 * and the value of the property is an array of elements.
 * Example:
 *
 * <code>
 *
 * [
 *     {
 *         label: "A",
 *         elements:  [ "A", "Aachen", "Adams", ... ]
 *     },
 *     {
 *         label: "B",
 *         elements: ["B", "Baaa", "Boo"]
 *     },
 *     ...
 *     {
 *         label: "#",
 *         elements: ["3par.com", "@handle"]
 *     }
 * ]
 * </code>
 *
 * All elements within a bucket are sorted per the collation
 * for the locale of this index.
 *
 * @returns {Object} a hash of all buckets and elements
 * as per the description above.
 */
AlphabeticIndex.prototype.getAllBuckets = function() {
    var underflowIndex = -1, overflowIndex = -1;
    var mixedScriptEndIndex = -1;
    var count = 0;
    var temp;
    var i;

    var tempArr = [];
    var tempIndex = [];
    var tempBucket = {};
    var itemIndex;

    for (i=0; i < this.index.length; i++) {
        tempArr.push(this.index[i].label);
    }

    tempArr.sort(ilib.bind(this.collationObj, this.collationObj.compare));

    for (i=0; i < tempArr.length; i++) {
        tempBucket={};
        tempBucket.label = tempArr[i];
        itemIndex = this._getLabelIndex(tempArr[i]);

        this.index[itemIndex].elements.sort(ilib.bind(this.collationObj, this.collationObj.compare));
        tempBucket.elements = this.index[itemIndex].elements;
        tempIndex[i] = tempBucket;
        tempBucket={};
    }

    this.index = tempIndex;

    for (i=0; i < this.index.length; i++) {
        if (this.inherit &&
            this.mixedCollationMap[0].indexUnits.indexOf(this.index[i].label) === -1) {
            mixedScriptEndIndex = i;
            count++;
        }
    }

    if (this.inherit && count > 0) {
        temp = this.index.splice((mixedScriptEndIndex - count) +1 , count);
        this.index = this.index.concat(temp);
    }

    for (i=0; i < this.index.length; i++) {
        if (this.index[i].label === this.underflowLabel) {
            underflowIndex = i
            break;
        }
    }

    if (underflowIndex > 0) {
        temp = this.index.splice(underflowIndex,1)[0];
        this.index.unshift(temp);
    }

    for (i=0; i < this.index.length; i++) {
        if (this.index[i].label === this.overflowLabel) {
            overflowIndex = i
            break;
        }
    }

    if (overflowIndex > -1) {
        temp = this.index.splice(overflowIndex,1)[0];
        this.index.push(temp);
    }

    return this.index;
};

/**
 * Return the label of the bucket for a given element. This
 * follows the rules set up when the index was instantiated to
 * find the bucket into which the element would go if it
 * were added to this index. The element is not added to
 * the index, however. (See addElement for that.)
 *
 * @param {string|undefined} element the element to check
 * @returns {string|undefined} the label for the bucket for this element
 */
AlphabeticIndex.prototype.getBucket = function(element) {
    var label;
    var firstChar;
    var collationValue;
    var charNum, firstBoundaryChar, endBoundaryChar, firstCharNum, endCharNum;
    var validMapNum = -1;

    if (!element) {
        return undefined;
    }

    firstChar = this._getFirstChar(element);

    if (this.inherit) {
        for (var i = 0; i < this.mixedCollationMap.length; i++) {
            if (this.mixedCollationMap[i].map[firstChar]) {
                collationValue = this.mixedCollationMap[i].map[firstChar];
                validMapNum = i;
                this.flowBoundaries = this.mixedCollationMap[validMapNum].flowBoundaries;
                this.indexUnits = this.mixedCollationMap[validMapNum].indexUnits;
                break;
            }
        }
    } else {
        collationValue = this.collationMap[firstChar];
    }

    if (collationValue) {
        if (typeof collationValue[0] === 'number') {
            if (collationValue[0] < this.flowBoundaries[0]) {
                label = this.underflowLabel;
            } else if (collationValue[0] > this.flowBoundaries[1]){
                label = this.overflowLabel;
            } else {
                label = this._getKeyByValue(collationValue, validMapNum);
            }
        } else if (typeof collationValue[0] === 'object') {
            label = this._getKeyByValue(collationValue[0], validMapNum);
        }
    } else {
        charNum = IString.toCodePoint(firstChar, 0);

        if (this.inherit) {
            for (var i=0; i < this.inherit.length; i++) {
                firstBoundaryChar = this._getKeyByValue([this.mixedCollationMap[i].flowBoundaries[0]], i);
                firstCharNum = IString.toCodePoint(firstBoundaryChar, 0);

                if (charNum < firstCharNum) {
                    continue;
                } else {
                    break;
                }
            }
            label = ((i === this.inherit.length)? this.underflowLabel: this.overflowLabel)
        } else {
            firstBoundaryChar = this._getKeyByValue([this.flowBoundaries[0]], 0);
            endBoundaryChar = this._getKeyByValue([this.flowBoundaries[1]], 0);

            firstCharNum = IString.toCodePoint(firstBoundaryChar, 0);
            endCharNum = IString.toCodePoint(endBoundaryChar, 0);

            if (charNum < firstCharNum) {
                label = this.underflowLabel;
            } else if (charNum > endCharNum) {
                label = this.overflowLabel;
            } else {
                label = this.overflowLabel;
            }
        }
    }
    return label;
};

/**
 * Return default indexing style in the current locale.
 * @returns {string} the default indexing style for this locale.
 */
AlphabeticIndex.prototype.getIndexStyle = function() {
    return this.style;
};

/**
 * Return the total number of buckets in this index.
 * @returns {number} the number of buckets in this index
 */
AlphabeticIndex.prototype.getBucketCount = function() {
    var count = Object.keys(this.index).length;
    return count;
};

/**
 * Return the bucket labels for this index in order. This
 * method only returns the index labels for buckets that
 * actually contain elements. This
 * will include the under- and overflow labels if
 * they are used in this index.
 *
 * @returns {Array.<String>} the array of bucket labels
 * for this index in collation order
 */
AlphabeticIndex.prototype.getBucketLabels = function() {
    return this.getAllBuckets().map(function(bucket){
        return bucket.label;
    })
};

/**
 * Return the all the bucket labels typically used in the
 * locale. This includes all bucket labels, even if those
 * buckets do not contain any elements.
 *
 * @returns {Array.<String>} the array of bucket labels
 * for this index in collation order
 */
AlphabeticIndex.prototype.getAllBucketLabels = function() {
    if (this.allBucketLabels) {
        return this.allBucketLabels;
    }

    this.allBucketLabels = new Array();
    this.allBucketLabels = [this.underflowLabel].concat(this.indexUnits, this.overflowLabel);
    return this.allBucketLabels;
};

/**
 * Return the collator used to sort elements in this
 * index.
 *
 * @return {Collator} the ilib Collator instance used
 * in this index
 */
AlphabeticIndex.prototype.getCollator = function() {
    return this.collationObj;
};

/**
 * Get the default label used in the for overflow bucket.
 * This is the first item in a list. eg. ... A B C
 *
 * @return {string} the overflow bucket label
 */
AlphabeticIndex.prototype.getOverflowLabel = function() {
    return this.overflowLabel;
};

/**
 * Return the total number of elements in the index. This includes
 * all elements across all buckets.
 *
 * @returns {number} The number of elements in the index
 */
AlphabeticIndex.prototype.getElementCount = function() {
    var buckets = this.index;
    var i, count = 0;

    for (i=0; i < buckets.length; i++) {
        count += buckets[i].elements.length;
    }

    return count;
};

/**
 * Get the default label used in underflow,
 * This is the last item in a list. eg. the last
 * item in: X Y Z #
 *
 * @returns {string} the label used for underflow elements
 */
AlphabeticIndex.prototype.getUnderflowLabel = function() {
    return this.underflowLabel;
};

/**
 * Set the overflow bucket label.
 *
 * @param {string} overflowLabel the label to use for the overflow buckets
 */
AlphabeticIndex.prototype.setOverflowLabel = function(overflowLabel) {
    this.overflowLabel = overflowLabel;
};

/**
 * Set the underflow bucket label.
 *
 * @param {string} underflowLabel the label to use for the underflow buckets
 */
AlphabeticIndex.prototype.setUnderflowLabel = function(underflowLabel) {
    this.underflowLabel = underflowLabel;
};

module.exports = AlphabeticIndex;
