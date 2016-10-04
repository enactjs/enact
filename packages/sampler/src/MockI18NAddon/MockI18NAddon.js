import React from 'react';
import {select} from '@kadira/storybook-addon-knobs';
import {isRtl, getI18nClasses, updateLocale} from '@enact/i18n/src/locale';

class WrappedMockI18N extends React.Component {
	static childContextTypes = {
		rtl: React.PropTypes.bool
	};

	static propTypes = {
		children: React.PropTypes.object,
		className: React.PropTypes.string,
		locale: React.PropTypes.string
	}

	constructor (props) {
		super(props);
		updateLocale(this.props.locale);
	}

	componentWillReceiveProps (newProps) {
		updateLocale(newProps.locale);
	}

	getChildContext () {
		return {
			rtl: isRtl()
		};
	}

	render () {
		let classes = getI18nClasses();
		if (this.props.className) {
			classes = `${this.props.className} ${classes}`;
		}

		return (
			<div className={classes}>
				{this.props.children}
			</div>
		);
	}
}

// NOTE: Locales taken from strawman. Might need to add more in the future.
const locales = [
	'en-US',
	'ko-KR',
	'th-TH ',
	'ar-SA',
	'ur-PK',
	'zh-Hant-HK',
	'ja-JP',
	'en-JP'
];

/**
 * Use this to override the context of i18nDecorator. This allows us to use
 * knobs to toggle and override the locale
 *
 * To import use:
 * import MockI18NAddon from '../../src/MockI18NAddon';
 *
 * To use MockI18NAddon you can call it in a decorator with the argument of
 * default locale.
 *
 * .addDecorator(MockI18NAddon('en-US'))
 *
 * When using make sure to put MockI18NAddon before withKnobs.
 * .addDecorator(MockI18NAddon('en-US'))
 * .addDecorator(withKnobs)
 *
 * @class WrappedMockI18N
 * @private
 */

const MockI18NAddon = (defaultLocale = 'en-US') => (story) => {
	return <WrappedMockI18N
		locale={select('locale', locales, defaultLocale)}
	>
		{story()}
	</WrappedMockI18N>;
};

export default MockI18NAddon;
