import {on, off} from '@enact/core/dispatcher';
import {Job} from '@enact/core/util';

import {isRtlLocale, updateLocale} from '../locale';
import {createResBundle, setResBundle} from '../src/resBundle';
import wrapIlibCallback from '../src/wrapIlibCallback';

import getI18nClasses from './getI18nClasses';
import {onWindowFocus} from './windowFocus';

/**
 * Manages i18n resource loading.
 *
 * @class I18n
 * @private
 */
class I18n {
	constructor ({
		latinLanguageOverrides,
		nonLatinLanguageOverrides,
		resources,
		sync = true
	}) {
		this._locale = null;
		this._ready = sync;
		this._onLoadResources = () => {};
		this.loadResourceJob = null;

		this.latinLanguageOverrides = latinLanguageOverrides;
		this.nonLatinLanguageOverrides = nonLatinLanguageOverrides;
		this.resources = this.normalizeResources(resources);
		this.sync = sync;
	}

	/**
	 * Sets the current locale and load callback.
	 *
	 * Changing the locale will request new resource files for that locale.
	 *
	 * @type {String}
	 * @public
	 */
	setContext (locale, onLoadResources) {
		this.loadResourceJob = new Job(onLoadResources);
		this._onLoadResources = onLoadResources;

		if (this._locale !== locale) {
			this._locale = locale;

			this.loadResources(locale);
		}
	}

	/**
	 * Normalize the structure of the external resources to be an array of resource/onLoad pairs.
	 *
	 * @private
	 */
	normalizeResources (resources) {
		return Array.isArray(resources) ? resources.map(res => {
			if (!res) return;

			const fn = res.resource || res;
			const onLoad = res.onLoad;

			if (typeof fn !== 'function') return;

			return {resource: fn, onLoad};
		}).filter(Boolean) : [];
	}

	/**
	 * Adds the `languagechange` event listener and initiates async resource retrieval.
	 *
	 * Should only be called after `window` is available and the DOM is ready.
	 *
	 * @public
	 */
	load () {
		this._ready = true;

		if (typeof window === 'object') {
			on('languagechange', this.handleLocaleChange, window);
		}

		// When async, we defer loading resources until DOM is ready
		if (!this.sync) {
			this.loadResources(this._locale);
		}
	}

	/**
	 * Cleans up resource retrieval and event listeners.
	 *
	 * @public
	 */
	unload () {
		this._ready = false;

		this.loadResourceJob.stop();
		if (typeof window === 'object') {
			off('languagechange', this.handleLocaleChange, window);
		}
	}

	/**
	 * Loads the resources for the given locale.
	 *
	 * @private
	 */
	loadResources (spec) {
		if (!this._ready) return;

		const locale = updateLocale(spec);
		const options = {sync: this.sync, locale};
		const rtl = wrapIlibCallback(isRtlLocale, options);
		const className = wrapIlibCallback(getI18nClasses, {
			...options,
			latinLanguageOverrides: this.latinLanguageOverrides,
			nonLatinLanguageOverrides: this.nonLatinLanguageOverrides
		});
		const bundle = wrapIlibCallback(createResBundle, options);
		console.warn("@@ load start", locale);

		if (this.sync) {
			const state = {
				className,
				loaded: true,
				locale,
				rtl
			};

			setResBundle(bundle);

			this.resources.forEach(({resource, onLoad}) => {
				const result = resource(options);
				if (onLoad) onLoad(result);
			});

			this._onLoadResources(state);
		} else {
			const resources = Promise.all([
				rtl,
				className,
				// move updating into a new method with call to setState
				bundle,
				...this.resources.map(res => wrapIlibCallback(res.resource, options))
			]).then(([rtlResult, classNameResult, bundleResult, ...userResources]) => {
				setResBundle(bundleResult);
				this.resources.forEach(({onLoad}, i) => onLoad && onLoad(userResources[i]));

				return {
					className: classNameResult,
					loaded: true,
					locale,
					rtl: rtlResult
				};
			});
			// TODO: Resolve how to handle failed resource requests
			// .catch(...);

			this.loadResourceJob.promise(resources);
		}
	}

	/**
	 * Called when the `languagechange` event fires.
	 */
	handleLocaleChange = () => {
		onWindowFocus(this.updateLocale);
	};

	/**
	 * Updates the locale for the application.
	 *
	 * If `newLocale` is omitted, the locale will be reset to the device's default locale.
	 *
	 * @param   {String}    newLocale   Locale identifier string
	 *
	 * @returns {undefined}
	 * @public
	 */
	updateLocale = (newLocale) => {
		this.loadResources(newLocale);
	};
}

export default I18n;
export {
	I18n
};
