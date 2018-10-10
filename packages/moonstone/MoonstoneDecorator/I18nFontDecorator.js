import hoc from '@enact/core/hoc';
import ilib from '@enact/i18n';
import React from 'react';
import PropTypes from 'prop-types';

import {fontGenerator, fontOverrideGenerator} from './fontGenerator';

const I18nFontDecorator = hoc((config, Wrapped) => {	// eslint-disable-line no-unused-vars
	return class I18nDecorator extends React.Component {
		static displayName = 'I18nFontDecorator'

		static propTypes = {
			locale: PropTypes.string
		}

		constructor (props) {
			super(props);

			this.state = {
				locale: props.locale || ilib.getLocale()
			};
		}

		componentDidMount () {
			fontGenerator(this.state.locale);
			fontOverrideGenerator(this.state.locale);
		}

		componentWillReceiveProps () {
			this.setState((state, nextProps) => {
				const locale = nextProps.locale || ilib.getLocale();
				return locale !== state.locale ? {locale} : null;
			});
		}

		componentDidUpdate (_, prevState) {
			if (prevState.locale !== this.state.locale) {
				fontOverrideGenerator(this.state.locale);
			}
		}

		render () {
			return (
				<Wrapped {...this.props} />
			);
		}
	};
});

export default I18nFontDecorator;
export {
	I18nFontDecorator
};
