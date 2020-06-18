import hoc from '@enact/core/hoc';
import pick from 'ramda/src/pick';
import omit from 'ramda/src/omit';
import React from 'react';

const MemoPropsThemeContext = React.createContext();
const MemoPropsContext = React.createContext();

const defaultConfig = {
	filter: []
};

const MemoPropsDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {filter} = config;

	// eslint-disable-next-line no-shadow
	function MemoPropsDecorator (props) {
		const picked = pick(filter, props) || {};
		const omitted = omit(filter, props) || {};

		return (
			<MemoPropsContext.Provider value={picked}>
				<Wrapped {...omitted} />
			</MemoPropsContext.Provider>
		);
	}

	return MemoPropsDecorator;
});

const MemoPropsThemeDecorator = hoc(defaultConfig, (config, Wrapped) => {
	// eslint-disable-next-line no-shadow
	function MemoPropsThemeDecorator (props) {
		return (
			<MemoPropsThemeContext.Provider value={props}>
				<Wrapped {...props} />
			</MemoPropsThemeContext.Provider>
		);
	}

	return MemoPropsThemeDecorator;
});

const ContextConsumer = (Context) => (fn) => { // eslint-disable-line enact/display-name
	return (
		<Context.Consumer>
			{fn}
		</Context.Consumer>
	);
};

const MemoPropsContextConsumer = ContextConsumer(MemoPropsContext);
const MemoPropsThemeContextConsumer = ContextConsumer(MemoPropsThemeContext);

export default MemoPropsThemeContext;
export {
	MemoPropsContextConsumer,
	MemoPropsDecorator,
	MemoPropsThemeContextConsumer,
	MemoPropsThemeDecorator
};
