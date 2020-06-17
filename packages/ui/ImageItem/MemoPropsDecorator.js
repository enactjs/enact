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
	function MemoPropsDecorator ({context, ...rest}) {
		const picked = pick(filter, rest) || {};
		const omitted = omit(filter, rest) || {};

		if (context) {
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
		 * The caption displayed with the image.
		 *
		 * @type {Node}
		 * @public
		 */
		children: PropTypes.node
	};

	return MemoPropsDecorator;
});

const useContext = (Context) => (fn) => {
	return (
		<Context.Consumer>
			{fn}
		</Context.Consumer>
	);
};

export default MemoPropsThemeContext;
export {
	MemoPropsContext,
	MemoPropsDecorator,
	MemoPropsThemeContext,
	useContext
};
