import React from 'react';

import I18n from './I18n';

function useI18n ({locale, ...config}) {
	const [state, setState] = React.useState({
		locale,
		loaded: Boolean(config.sync)
	});

	const inst = React.useRef(null);
	inst.current = inst.current || new I18n({
		onLoadResources: setState,
		...config
	});

	inst.current.locale = locale;

	return {
		...state,
		updateLocale: inst.current.updateLocale
	};
}

export default useI18n;
export {
	useI18n
};
