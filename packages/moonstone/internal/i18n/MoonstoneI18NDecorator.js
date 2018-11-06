import hoc from '@enact/core/hoc';
import I18nDecorator, {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import wrapIlibCallback from '@enact/i18n/src/wrapIlibCallback';
import PropTypes from 'prop-types';
import React from 'react';

import {createResBundle, setResBundle} from './resBundle';

const defaultConfig = {
	sync: true
};

const MoonstoneI18NDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {sync} = config;

	class Decorator extends React.Component {
		static displayName = 'MoonstoneI18NDecorator'

		static propTypes = {
			/**
			 * A string with a {@link https://tools.ietf.org/html/rfc5646|BCP 47 language tag}.
			 *
			 * The system locale will be used by default.
			 *
			 * @type {String}
			 * @public
			 */
			locale: PropTypes.string
		}

		componentDidMount () {
			this.loadResources(this.props.locale);
		}

		componentWillReceiveProps (nextProps) {
			if (this.props.locale !== nextProps.locale) {
				if (sync) {
					const options = {locale: nextProps.locale, sync};
					const bundle = wrapIlibCallback(createResBundle, options);
					setResBundle(bundle);
				} else {
					this.loadResources(nextProps.locale);
				}
			}
		}

		loadResources (locale) {
			const options = {sync, locale};
			Promise.resolve(
				wrapIlibCallback(createResBundle, options)
			).then(bundle => {
				setResBundle(bundle);
			});

			// TOOD: How do we trigger $L to execute once resources are loaded?
		}

		render () {
			return <Wrapped {...this.props} />;
		}
	}

	return I18nDecorator(
		{
			...config,
			// We use the latin fonts (with non-Latin fallback) for these languages (even though
			// their scripts are non-latin)
			latinLanguageOverrides: ['ko', 'ha'],
			// We use the non-latin fonts for these languages (even though their scripts are
			// technically considered latin)
			nonLatinLanguageOverrides: ['vi', 'en-JP']
		},
		I18nContextDecorator(
			{localeProp: 'locale'},
			Decorator
		)
	);
});

export default MoonstoneI18NDecorator;
