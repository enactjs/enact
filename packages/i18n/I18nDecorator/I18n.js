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
 * Implements the external store contract expected by `useSyncExternalStore`:
 * `subscribe`, `getSnapshot`, and `getServerSnapshot`.
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
		this.loadResourceJob = new Job(state => this._updateSnapshot(state));
		this._listeners = new Set();
		this._snapshot = {
			className: null,
			loaded: sync,
			locale: null,
			rtl: false
		};

		this.latinLanguageOverrides = latinLanguageOverrides;
		this.nonLatinLanguageOverrides = nonLatinLanguageOverrides;
		this.resources = this.normalizeResources(resources);
		this.sync = sync;
	}

	/**
	 * Subscribes a listener to store updates.
	 *
	 * Returns an unsubscribe function, as required by `useSyncExternalStore`.
	 *
	 * @param {Function} listener Called whenever the snapshot changes
	 * @returns {Function} Unsubscribe function
	 * @public
	 */
	subscribe = (listener) => {
		this._listeners.add(listener);
		return () => this._listeners.delete(listener);
	};

	/**
	 * Returns the current snapshot of the i18n state.
	 *
	 * @returns {{className: String, loaded: Boolean, locale: String, rtl: Boolean}}
	 * @public
	 */
	getSnapshot = () => this._snapshot;

	/**
	 * Returns the server-side snapshot (for SSR).
	 *
	 * Sync mode is assumed on the server so `loaded` is always `true`.
	 *
	 * @returns {{className: String, loaded: Boolean, locale: String, rtl: Boolean}}
	 * @public
	 */
	getServerSnapshot = () => ({
		className: null,
		loaded: true,
		locale: this._locale,
		rtl: false
	});

	/**
	 * Notifies all subscribers that the snapshot has changed.
	 *
	 * @private
	 */
	_notifyListeners () {
		this._listeners.forEach(l => l());
	}

	/**
	 * Updates the snapshot and notifies subscribers when the store is ready.
	 *
	 * `_ready` reflects whether `load()` has run. In async mode it starts `false`,
	 * which suppresses notifications for the synchronous `setContext` call made
	 * during the first render (the initial snapshot is published by the first
	 * `getSnapshot` read instead). In sync mode `_ready` is `true` from
	 * construction, so updates notify immediately; `useSyncExternalStore` is
	 * responsible for the tearing check under concurrent rendering.
	 *
	 * @param {Object} newState New snapshot values
	 * @private
	 */
	_updateSnapshot (newState) {
		this._snapshot = newState;
		if (this._ready) {
			this._notifyListeners();
		}
	}

	/**
	 * Sets the current locale.
	 *
	 * Changing the locale will request new resource files for that locale.
	 *
	 * @param {String} locale BCP 47 locale identifier
	 * @public
	 */
	setContext (locale) {
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

		if (this.sync) {
			setResBundle(bundle);

			this.resources.forEach(({resource, onLoad}) => {
				const result = resource(options);
				if (onLoad) onLoad(result);
			});

			this._updateSnapshot({
				className,
				loaded: true,
				locale,
				rtl
			});
		} else {
			const resources = Promise.all([
				rtl,
				className,
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
