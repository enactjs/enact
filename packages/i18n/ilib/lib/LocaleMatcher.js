/*
 * LocaleMatcher.js - Locale matcher definition
 *
 * Copyright © 2013-2015, JEDLSoft
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

// !depends ilib.js Locale.js Utils.js
// !data localematch

var ilib = require("./ilib.js");
var Utils = require("./Utils.js");
var Locale = require("./Locale.js");

var componentWeights = [
	0.5,   // language
	0.2,   // script
	0.25,  // region
	0.05   // variant
];

/**
 * @class
 * Create a new locale matcher instance. This is used
 * to see which locales can be matched with each other in
 * various ways.<p>
 *
 * The options object may contain any of the following properties:
 *
 * <ul>
 * <li><i>locale</i> - the locale instance or locale spec to match
 *
 * <li><i>onLoad</i> - a callback function to call when the locale matcher object is fully
 * loaded. When the onLoad option is given, the locale matcher object will attempt to
 * load any missing locale data using the ilib loader callback.
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
 *
 * @constructor
 * @param {Object} options parameters to initialize this matcher
 */
var LocaleMatcher = function(options) {
	var sync = true,
	    loadParams = undefined;

	this.locale = new Locale();

	if (options) {
		if (typeof(options.locale) !== 'undefined') {
			this.locale = (typeof(options.locale) === 'string') ? new Locale(options.locale) : options.locale;
		}

		if (typeof(options.sync) !== 'undefined') {
			sync = (options.sync == true);
		}

		if (typeof(options.loadParams) !== 'undefined') {
			loadParams = options.loadParams;
		}
	}

	if (typeof(ilib.data.localematch) === 'undefined') {
		Utils.loadData({
			object: "LocaleMatcher",
			locale: "-",
			name: "localematch.json",
			sync: sync,
			loadParams: loadParams,
			callback: ilib.bind(this, function (info) {
				if (!info) {
					info = {};
					var spec = this.locale.getSpec().replace(/-/g, "_");
					ilib.data.cache.LocaleMatcher[spec] = info;
				}
				/** @type {Object.<string,string>} */
				this.info = info;
				if (options && typeof(options.onLoad) === 'function') {
					options.onLoad(this);
				}
			})
		});
	} else {
		this.info = ilib.data.localematch;
		if (options && typeof(options.onLoad) === 'function') {
            options.onLoad(this);
        }
	}
};


LocaleMatcher.prototype = {
	/**
	 * Return the locale used to construct this instance.
	 * @return {Locale|undefined} the locale for this matcher
	 */
	getLocale: function() {
		return this.locale;
	},

	/**
	 * @private
	 * Do the work
	 */
	_getLikelyLocale: function(locale) {
	    // already full specified
	    if (locale.language && locale.script && locale.region) return locale;
	    
        if (typeof(this.info.likelyLocales[locale.getSpec()]) === 'undefined') {
            // try various partials before giving up
            var partial = this.info.likelyLocales[new Locale(locale.language, undefined, locale.region).getSpec()];
            if (typeof(partial) !== 'undefined') return new Locale(partial);

            partial = this.info.likelyLocales[new Locale(locale.language, locale.script, undefined).getSpec()];
            if (typeof(partial) !== 'undefined') return new Locale(partial);

            partial = this.info.likelyLocales[new Locale(locale.language, undefined, undefined).getSpec()];
            if (typeof(partial) !== 'undefined') return new Locale(partial);

            partial = this.info.likelyLocales[new Locale(undefined, locale.script, locale.region).getSpec()];
            if (typeof(partial) !== 'undefined') return new Locale(partial);

            partial = this.info.likelyLocales[new Locale(undefined, undefined, locale.region).getSpec()];
            if (typeof(partial) !== 'undefined') return new Locale(partial);

            partial = this.info.likelyLocales[new Locale(undefined, locale.script, undefined).getSpec()];
            if (typeof(partial) !== 'undefined') return new Locale(partial);

            return locale;
        }

        return new Locale(this.info.likelyLocales[locale.getSpec()]);
	},

	/**
	 * Return an Locale instance that is fully specified based on partial information
	 * given to the constructor of this locale matcher instance. For example, if the locale
	 * spec given to this locale matcher instance is simply "ru" (for the Russian language),
	 * then it will fill in the missing region and script tags and return a locale with
	 * the specifier "ru-Cyrl-RU". (ie. Russian language, Cyrillic, Russian Federation).
	 * Any one or two of the language, script, or region parts may be left unspecified,
	 * and the other one or two parts will be filled in automatically. If this
	 * class has no information about the given locale, then the locale of this
	 * locale matcher instance is returned unchanged.
	 *
	 * @returns {Locale} the most likely completion of the partial locale given
	 * to the constructor of this locale matcher instance
	 */
	getLikelyLocale: function () {
	    return this._getLikelyLocale(this.locale);
	},

	/**
	 * Return the degree that the given locale matches the current locale of this
	 * matcher. This method returns an integer from 0 to 100. A value of 100 is
	 * a 100% match, meaning that the two locales are exactly equivalent to each
	 * other. (eg. "ja-JP" and "ja-JP") A value of 0 means that there 0% match or
	 * that the two locales have nothing in common. (eg. "en-US" and "ja-JP") <p>
	 *
	 * Locale matching is not the same as equivalence, as the degree of matching
	 * is returned. (See Locale.equals for equivalence.)<p>
	 *
	 * The match score is calculated based on matching the 4 locale components,
	 * weighted by importance:
	 *
	 * <ul>
	 * <li> language - this accounts for 50% of the match score
	 * <li> region - accounts for 25% of the match score
	 * <li> script - accounts for 20% of the match score
	 * <li> variant - accounts for 5% of the match score
	 * </ul>
	 *
	 * The score is affected by the following things:
	 *
	 * <ul>
	 * <li> A large language score is given when the language components of the locales
	 * match exactly.
	 * <li> Higher language scores are given when the languages are linguistically
	 * close to each other, such as dialects.
	 * <li> A small score is given when two languages are in the same
	 * linguistic family, but one is not a dialect of the other, such as German
	 * and Dutch.
	 * <li> A large region score is given when two locales share the same region.
	 * <li> A smaller region score is given when one region is contained within
	 * another. For example, Hong Kong is part of China, so a moderate score is
	 * given instead of a full score.
	 * <li> A small score is given if two regions are geographically close to
	 * each other or are tied by history. For example, Ireland and Great Britain
	 * are both adjacent and tied by history, so they receive a moderate score.
	 * <li> A high script score is given if the two locales share the same script.
	 * The legibility of a common script means that there is some small kinship of the
	 * different languages.
	 * <li> A high variant score is given if the two locales share the same
	 * variant. Full score is given when both locales have no variant at all.
	 * <li> Locale components that are unspecified in both locales are given high
	 * scores.
	 * <li> Locales where a particular locale component is missing in only one
	 * locale can still match when the default for that locale component matches
	 * the component in the other locale. The
	 * default value for the missing component is determined using the likely locales
	 * data. (See getLikelyLocale()) For example, "en-US" and "en-Latn-US" receive
	 * a high script score because the default script for "en" is "Latn".
	 * </ul>
	 *
	 * The intention of this method is that it can be used to determine
	 * compatibility of locales. For example, when a user signs up for an
	 * account on a web site, the locales that the web site supports and
	 * the locale of the user's browser may differ, and the site needs to
	 * pick the best locale to show the user. Let's say the
	 * web site supports a selection of European languages such as "it-IT",
	 * "fr-FR", "de-DE", and "en-GB". The user's
	 * browser may be set to "it-CH". The web site code can then match "it-CH"
	 * against each of the supported locales to find the one with the
	 * highest score. In
	 * this case, the best match would be "it-IT" because it shares a
	 * language and script in common with "it-CH" and differs only in the region
	 * component. It is not a 100% match, but it is pretty good. The web site
	 * may decide if the match scores all fall
	 * below a chosen threshold (perhaps 50%?), it should show the user the
	 * default language "en-GB", because that is probably a better choice
	 * than any other supported locale.<p>
	 *
	 * @param {Locale} locale the other locale to match against the current one
	 * @return {number} an integer from 0 to 100 that indicates the degree to
	 * which these locales match each other
	 */
	match: function(locale) {
		var other = new Locale(locale);
		var scores = [0, 0, 0, 0];

		if (this.locale.language === other.language) {
			scores[0] = 100;
		} else {
			if (!this.locale.language || !other.language) {
				// check for default language
				var thisfull = this.getLikelyLocale();
				var otherfull = new Locale(this.info.likelyLocales[other.getSpec()] || other.getSpec());
				if (thisfull.language === otherfull.language) {
					scores[0] = 100;
				}
			} else {
				// check for macro languages
				var mlthis = this.info.macroLanguagesReverse[this.locale.language] || this.locale.language;
				var mlother = this.info.macroLanguagesReverse[other.language] || other.language;
				if (mlthis === mlother) {
					scores[0] = 90;
				} else {
					// check for mutual intelligibility
					var pair = this.locale.language + "-" + other.language;
					scores[0] = this.info.mutualIntelligibility[pair] || 0;
				}
			}
		}

		if (this.locale.script === other.script) {
			scores[1] = 100;
		} else {
			if (!this.locale.script || !other.script) {
				// check for default script
				var thisfull = this.locale.script ? this.locale : new Locale(this.info.likelyLocales[this.locale.language]);
				var otherfull = other.script ? other : new Locale(this.info.likelyLocales[other.language]);
				if (thisfull.script === otherfull.script) {
					scores[1] = 100;
				}
			}
		}

		if (this.locale.region === other.region) {
			scores[2] = 100;
		} else {
			if (!this.locale.region || !other.region) {
				// check for default region
				var thisfull = this.getLikelyLocale();
				var otherfull = new Locale(this.info.likelyLocales[other.getSpec()] || other.getSpec());
				if (thisfull.region === otherfull.region) {
					scores[2] = 100;
				}
			} else {
				// check for containment
				var containers = this.info.territoryContainmentReverse[this.locale.region] || [];
				// end at 1 because 0 is "001" which is "the whole world" -- which is not useful
				for (var i = containers.length-1; i > 0; i--) {
					var container = this.info.territoryContainment[containers[i]];
					if (container && container.indexOf(other.region) > -1) {
						// same area only accounts for 20% of the region score
						scores[2] = ((i+1) * 100 / containers.length) * 0.2;
						break;
					}
				}
			}
		}

		if (this.locale.variant === other.variant) {
			scores[3] = 100;
		}

		var total = 0;

		for (var i = 0; i < 4; i++) {
			total += scores[i] * componentWeights[i];
		}

		return Math.round(total);
	},

    /**
     * Return the macrolanguage associated with this locale. If the
     * locale's language is not part of a macro-language, then the
     * locale's language is returned as-is.
     *
     * @returns {string} the ISO code for the macrolanguage associated
     * with this locale, or language of the locale
     */
    getMacroLanguage: function() {
        return this.info.macroLanguagesReverse[this.locale.language] || this.locale.language;
    },

    /**
     * @private
     * Return the containment array for the given region code.
     */
    _getRegionContainment: function(region) {
        return this.info.territoryContainmentReverse[region] || []
    },

    /**
     * Return the list of regions that this locale is contained within. Regions are
     * nested, so locales can be in multiple regions. (eg. US is in Northern North
     * America, North America, the Americas, the World.) Most regions are specified
     * using UN.49 region numbers, though some, like "EU", are letters. If the
     * locale is underspecified, this method will use the most likely locale method
     * to get the region first. For example, the locale "ja" (Japanese) is most
     * likely "ja-JP" (Japanese for Japan), and the region containment info for Japan
     * is returned.
     *
     * @returns {Array.<string>} an array of region specifiers that this locale is within
     */
    getRegionContainment: function() {
        var region = this.locale.region || this.getLikelyLocale().region;
        return this._getRegionContainment(region);
    },

    /**
     * Find the smallest region that contains both the current locale and the other locale.
     * If the current or other locales are underspecified, this method will use the most
     * likely locale method
     * to get their regions first. For example, the locale "ja" (Japanese) is most
     * likely "ja-JP" (Japanese for Japan), and the region containment info for Japan
     * is checked against the other locale's region containment info.
     *
     * @param {String|Locale} otherLocale a locale specifier or a Locale instance to
     * compare against
     * @returns {string} the region specifier of the smallest region containing both the
     * current locale and other locale
     */
    smallestCommonRegion: function(otherLocale) {
        if (typeof(otherLocale) === "undefined") return "001";

        var thisRegion = this.locale.region || this.getLikelyLocale().region;
        var otherLoc = typeof(otherLocale) === "string" ? new Locale(otherLocale) : otherLocale;
        var otherRegion = this._getLikelyLocale(otherLoc).region;

        var thisRegions = this._getRegionContainment(thisRegion);
        var otherRegions = this._getRegionContainment(otherRegion);

        // region containment arrays are arranged from largest to smallest, so start
        // at the end of the array
        for (var i = thisRegions.length-1; i > 0; i--) {
            if (otherRegions.indexOf(thisRegions[i]) > -1) {
                return thisRegions[i];
            }
        }

        // this default should never be reached because the world should be common to all regions
        return "001";
    }
};

module.exports = LocaleMatcher;
