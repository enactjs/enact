/**
 * Adds Internationalization (I18N) support to an application using ilib.
 *
 * @module i18n/I18nDecorator
 * @exports I18nDecorator
 * @exports I18nContextDecorator
 */

import {on, off} from '@enact/core/dispatcher';
import {Job} from '@enact/core/util';

// import ilib from '../src/index.js';
import {isRtlLocale, updateLocale} from '../locale';
import {createResBundle, setResBundle} from '../src/resBundle';
import wrapIlibCallback from '../src/wrapIlibCallback';

import getI18nClasses from './getI18nClasses';
import {onWindowFocus} from './windowFocus';

class I18n {
	constructor ({
		latinLanguageOverrides,
		nonLatinLanguageOverrides,
		onLoadResources = () => {},
		resources,
		sync = true
	}) {
		// TODO: Maybe init locale in constructor for sync?
		// const ilibLocale = ilib.getLocale();

		this._locale = null;

		this.latinLanguageOverrides = latinLanguageOverrides;
		this.loadResourceJob = new Job(onLoadResources);
		this.nonLatinLanguageOverrides = nonLatinLanguageOverrides;
		this.onLoadResources = onLoadResources;
		this.resources = this.normalizeResources(resources);
		this.sync = sync;
	}

	set locale (locale) {
		if (this._locale !== locale) {
			this._locale = locale;
			this.loadResources(locale);
		}
	}

	normalizeResources (resources) {
		// Normalize the structure of the external resources to be an array of resource/onLoad pairs
		return Array.isArray(resources) ? resources.map(res => {
			if (!res) return;

			const fn = res.resource || res;
			const onLoad = res.onLoad;

			if (typeof fn !== 'function') return;

			return {resource: fn, onLoad};
		}).filter(Boolean) : [];
	}

	load () {
		if (typeof window === 'object') {
			on('languagechange', this.handleLocaleChange, window);
		}

		if (!this.sync) {
			this.loadResources(this.state.locale);
		}
	}

	unload () {
		this.loadResourceJob.stop();
		if (typeof window === 'object') {
			off('languagechange', this.handleLocaleChange, window);
		}
	}

	loadResources (spec) {
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

			this.onLoadResources(state);
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
			// TODO: Resolve how to handle failed resource resquests
			// .catch(...);

			this.loadResourceJob.promise(resources);
		}
	}

	handleLocaleChange = () => {
		onWindowFocus(this.updateLocale);
	}

	/**
	 * Updates the locale for the application. If `newLocale` is omitted, the locale will be
	 * reset to the device's default locale.
	 *
	 * @param	{String}	newLocale	Locale identifier string
	 *
	 * @returns	{undefined}
	 * @public
	 */
	updateLocale = (newLocale) => {
		this.loadResources(newLocale);
	}
}

export default I18n;
export {
	I18n
};
