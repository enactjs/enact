import React from 'react';

const I18nContext = React.createContext(null);

function useI18nContext () {
	// This isn't adding much value but does allow a layer of abstraction so we don't have to export
	// the I18nContext object and can add private API if needed later.
	return React.useContext(I18nContext);
}

export default useI18nContext;
export {
	useI18nContext,
	I18nContext
};
