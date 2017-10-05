import hoc from '@enact/core/hoc';
import ilib from '@enact/i18n';
import kind from '@enact/core/kind';
import React from 'react';

import fontGenerator from './fontGenerator';

const I18nFontDecorator = hoc((config, Wrapped) => kind({
	name: 'I18nFontDecorator',

	render: (props) => {
		fontGenerator(ilib.getLocale());
		return (
			<Wrapped {...props} />
		);
	}
}));

export default I18nFontDecorator;
export {I18nFontDecorator};
