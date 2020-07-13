import React from 'react';

import I18nDecorator, {I18nContextDecorator} from '../../../../I18nDecorator';
import Text from '../../../../Text';

let urlLocale;
let urlSync = false;
if (typeof window !== 'undefined') {
	const url = new URL(document.location);
	urlLocale = url.searchParams.get('locale');
	urlSync = url.searchParams.get('sync') === 'true';
}

const AppBase = ({loaded, locale, rtl, ...rest}) => (
	<div {...rest}>
		{document.location.href}
		<div id="loaded">
			{loaded ? 'Loaded' : 'Not Loaded'}
		</div>
		<div id="locale">
			{locale}
		</div>
		<div id="dir">
			{rtl ? 'RTL' : 'LTR'}
		</div>
		<div id="text">
			<Text>test</Text>
		</div>
	</div>
);

const App = I18nDecorator(
	{sync: urlSync},
	I18nContextDecorator(
		{loadedProp: 'loaded', localeProp: 'locale', rtlProp: 'rtl'},
		AppBase
	)
);

const app = () => <App locale={urlLocale} />;

export default app;
