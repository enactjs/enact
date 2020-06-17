import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';
import pick from 'ramda/src/pick';
import omit from 'ramda/src/omit';
import React from 'react';

const MemoPropsContext = React.createContext();
const MemoPropsChildrenContext = React.createContext();

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
				<MemoPropsChildrenContext.Provider value={picked}>
					<Wrapped {...omitted} />
				</MemoPropsChildrenContext.Provider>
			);
		} else {
			return (
				<MemoPropsContext.Provider value={rest}>
					<Wrapped {...omitted} />
				</MemoPropsContext.Provider>
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

export default MemoPropsContext;
export {
	MemoPropsContext,
	MemoPropsDecorator,
	MemoPropsChildrenContext
};
