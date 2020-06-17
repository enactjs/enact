import hoc from '@enact/core/hoc';
import React from 'react';

const MemoPropsContext = React.createContext();

const MemoPropsDecorator = hoc((config, Wrapped) => {
	// eslint-disable-next-line no-shadow
	function MemoPropsDecorator (props) {
		return (
			<MemoPropsContext.Provider value={props}>
				<Wrapped {...props} />
			</MemoPropsContext.Provider>
		);
	}

	return MemoPropsDecorator;
});

export default MemoPropsContext;
export {
	MemoPropsContext,
	MemoPropsDecorator
};
