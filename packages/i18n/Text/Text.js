/**
 * An unstyled text translation component.
 *
 * @module i18n/Text
 * @exports Text
 * @exports TextDecorator
 */

import hoc from '@enact/core/hoc';
import {checkPropTypes} from '@enact/core/util';
import ilib from 'ilib';
import IString from 'ilib/lib/IString';
import PropTypes from 'prop-types';
import {useEffect, useState} from 'react';

import {I18nContextDecorator} from '../I18nDecorator';
import {createResBundle, getIStringFromBundle, getResBundle} from '../src/resBundle';

function getTextMap (mapPropsToText, props) {
	const {children, defaultText} = props;

	if (mapPropsToText) {
		const map = {};
		Object.keys(mapPropsToText).forEach(prop => {
			const text = mapPropsToText[prop];

			// if a prop is specified without a proper value (string or object), ignore it
			if (text) {
				if (typeof text === 'string') {
					// for string text values, pass them along as the untranslated text
					// without a default value
					map[prop] = {translated: false, text, defaultText: false};
				} else if (typeof text.text === 'string') {
					// for object text values with a string text member, use it as the
					// untranslated text and optionally look for a string defaultText for a
					// default value
					map[prop] = {
						translated: false,
						text: text.text,
						defaultText: typeof text.defaultText === 'string' ?
							text.defaultText :
							false
					};
				}
			}
		});

		return  map;
	} else if (typeof children === 'string') {
		return {
			children: {
				translated: false,
				text: children,
				defaultText
			}
		};
	}
}

const STRING_ONLY = function () {};

/**
 * Default config for {@link i18n/Text.TextDecorator}.
 *
 * @memberof i18n/Text.TextDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Configures the translated text passed to the wrapped component.
	 *
	 * @type {Object<String, String|Object>}
	 * @default null
	 * @public
	 * @memberof i18n/Text.TextDecorator.defaultConfig
	 */
	mapPropsToText: null
};

/**
 * A higher-order component that is used to translate text and provide the translations via props.
 *
 * `TextDecorator` accepts an optional `mapPropsToText` config prop which defines the props it will
 * populate and the text to translate and provide in that prop. `defaultText` can also be provided
 * when appropriate.
 *
 * If translations are not available yet and all props do not include a default value,
 * `TextDecorator` will render nothing. Once translations are available, the component will update
 * with the translated strings.
 *
 * ```
 * TextDecorator({
 *   mapPropsToText: {
 *     // Always translate "Go" and pass it in the `children` prop
 *     children: 'Go',
 *     // Translate "Go to next page" but pass "" (value always untranslated) while
 *     // waiting for the translated strings to be fetched.
 *     'aria-label': {
 *       text: 'Go to next page',
 *       defaultText: ''
 *     }
 *   }
 * })
 * ```
 *
 * @class TextDecorator
 * @memberof i18n/Text
 * @hoc
 * @public
 */
const TextDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {mapPropsToText} = config;

	function Decorator (props) {
		checkPropTypes(Decorator, props);

		const {locale} = props;
		const [map, setMap] = useState(() => getTextMap(mapPropsToText, props));

		const shouldTranslate = mapPropsToText || typeof props.children === 'string';

		// Translate on mount and whenever the locale changes. The cleanup flag prevents a
		// pending translation from committing after the locale changes again or the component
		// unmounts.
		useEffect(() => {
			if (!shouldTranslate || !map) return;

			let active = true;
			const targetLocale = locale != null ? locale : ilib.getLocale();
			const bundle = getResBundle();

			Promise.all([
				new Promise((resolve) => {
					if (bundle) {
						resolve(bundle);
					}
					createResBundle({locale: targetLocale, sync: false, onLoad: resolve});
				}),
				// ResBundle.getString will try to synchronously fetch the plurals resource so need
				// to proactively fetch it to avoid the sync XHR
				new Promise(resolve => IString.loadPlurals(false, null, null, resolve))
			]).then(([resBundle]) => {
				if (!active || !resBundle) return;

				setMap(prevMap => Object.keys(prevMap).reduce((obj, prop) => {
					obj[prop].translated = String(getIStringFromBundle(obj[prop].text, resBundle));
					return obj;
				}, {...prevMap}));
			});

			return () => {
				active = false;
			};
		}, [locale, shouldTranslate]); // eslint-disable-line react-hooks/exhaustive-deps

		if (!shouldTranslate) {
			const passThrough = {...props};
			delete passThrough.locale;

			return (
				<Wrapped {...passThrough} />
			);
		}

		const canRender = Object.values(map).every(
			entry => !(entry.translated === false && entry.defaultText === false)
		);

		if (!canRender) {
			return null;
		}

		const getTextForProp = (prop) => {
			const {defaultText = '', translated} = map[prop];

			return translated === false ? defaultText : translated;
		};

		if (Wrapped === STRING_ONLY) {
			return getTextForProp('children');
		}

		const outProps = {...props};
		delete outProps.locale;

		Object.keys(map).forEach(prop => {
			outProps[prop] = getTextForProp(prop);
		});

		return (
			<Wrapped {...outProps} />
		);
	}

	Decorator.displayName = 'TextDecorator';

	Decorator.propTypes = /** @lends i18n/Text.TextDecorator.prototype */ {
		/**
		 * Passed to the wrapped component.
		 *
		 * If `mapPropsToText` is `null` and `children` is a string, the string will be
		 * translated before being passed to the wrapped component.
		 *
		 * @type {*}
		 * @public
		 */
		children: PropTypes.any,

		/**
		 * The locale for translation.
		 *
		 * If not supplied, the current locale is used.
		 *
		 * @type {String}
		 * @public
		 */
		locale: PropTypes.string
	};

	return I18nContextDecorator(
		{localeProp: 'locale'},
		Decorator
	);
});

/**
 * Translates its child string value in the current locale.
 *
 * If translations are not available yet, `Text` will render nothing. Once translations are
 * available, the component will update with the translated string.
 *
 * ```
 * <Text>Go</Text>
 * ```
 *
 * @class Text
 * @memberof i18n/Text
 * @mixes i18n/Text.TextDecorator
 * @ui
 * @public
 */
const Text = TextDecorator(STRING_ONLY);

/**
 * The string to be translated.
 *
 * @name children
 * @memberof i18n/Text.Text.prototype
 * @type {String}
 * @public
 */


export default Text;
export {
	Text,
	TextDecorator
};
