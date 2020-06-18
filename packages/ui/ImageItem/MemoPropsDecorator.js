import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';
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
	function MemoPropsDecorator ({isMemoPropsContext, ...rest}) {
		const picked = pick(filter, rest) || {};
		const omitted = omit(filter, rest) || {};

		if (isMemoPropsContext) {
			return (
				<MemoPropsContext.Provider value={picked}>
					<Wrapped {...omitted} />
				</MemoPropsContext.Provider>
			);
		} else {
			return (
				<MemoPropsThemeContext.Provider value={rest}>
					<Wrapped {...omitted} />
				</MemoPropsThemeContext.Provider>
			);
		}
	}

	MemoPropsDecorator.propTypes = /** @lends ui/MemoPropsDecorator.MemoPropsDecorator.prototype */ {
		/**
		 * If true, `MemoPropsThemeContext`'s context is passed.
		 *
		 * @type {Node}
		 * @private
		 */
		isMemoPropsContext: PropTypes.bool
	};

	return MemoPropsDecorator;
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
	MemoPropsThemeContextConsumer
};
