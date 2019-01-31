/**
 * An unstyled text translation component.
 *
 * @module i18n/Text
 * @exports Text
 * @exports TextDecorator
 */

import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';
import React from 'react';

import ilib from '../ilib/lib/ilib';
import IString from '../ilib/lib/IString';
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
 * `TextDecorator` will render nothing. Once translations are avaiable, the component will update
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

	const Decorator = class extends React.Component {
		static displayName = 'TextDecorator'

		static propTypes = {
			children: PropTypes.string,
			locale: PropTypes.string
		}

		constructor (props) {
			super(props);
			this.state = {
				map: getTextMap(mapPropsToText, props)
			};
		}

		componentDidMount () {
			if (this.shouldTranslate()) {
				this.translate(this.props.locale);
			}
		}

		componentDidUpdate (prevProps) {
			if (this.props.locale !== prevProps.locale) {
				this.translate(this.props.locale);
			}
		}

		shouldTranslate () {
			return mapPropsToText || typeof this.props.children === 'string';
		}

		translate (locale = ilib.getLocale()) {
			const {map} = this.state;
			const bundle = getResBundle();

			if (!map) return;

			const props = Object.keys(map);

			Promise.all([
				new Promise((resolve) => {
					if (bundle) {
						resolve(bundle);
					}
					createResBundle({locale, sync: false, onLoad: resolve});
				}),
				// ResBundle.getString will try to synchronously fetch the plurals resouce so need
				// to proactively fetch it to avoid the sync XHR
				new Promise(resolve => IString.loadPlurals(false, null, null, resolve))
			]).then(([resBundle]) => {
				if (!resBundle) return;

				const translated = props.reduce((obj, prop) => {
					obj[prop].translated = String(getIStringFromBundle(obj[prop].text, resBundle));

					return obj;
				}, {...map});

				this.setState({
					map: translated
				});
			});
		}

		canRender () {
			const entries = Object.values(this.state.map);
			for (const entry in entries) {
				if (entry.translated === false && entry.defaultText === false) {
					return false;
				}
			}

			return true;
		}

		getTextForProp (prop) {
			const {defaultText = '', translated} = this.state.map[prop];

			return translated === false ? defaultText : translated;
		}

		render () {
			if (!this.shouldTranslate()) {
				const passThrough = {...this.props};

				delete passThrough.locale;

				return (
					<Wrapped {...passThrough} />
				);
			}

			if (!this.canRender()) {
				return null;
			}

			if (Wrapped === STRING_ONLY) {
				return this.getTextForProp('children');
			}

			const props = {...this.props};
			delete props.locale;

			Object.keys(this.state.map).forEach(prop => {
				props[prop] = this.getTextForProp(prop);
			});

			return (
				<Wrapped {...props} />
			);
		}
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
 * avaiable, the component will update with the translated string.
 *
 * ```
 * <Text>Go</Text>
 * ```
 *
 * @class Text
 * @memberof i18n/Text
 * @public
 */
const Text = TextDecorator(STRING_ONLY);

export default Text;
export {
	Text,
	TextDecorator
};
