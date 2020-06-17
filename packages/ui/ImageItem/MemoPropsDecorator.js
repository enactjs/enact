import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';
import React from 'react';

const MemoPropsContext = React.createContext();
const MemoPropsChildrenContext = React.createContext();

const MemoPropsDecorator = hoc((config, Wrapped) => {
	// eslint-disable-next-line no-shadow
	function MemoPropsDecorator ({children, context, ...rest}) {
		if (context) {
			return (
				<MemoPropsChildrenContext.Provider value={{children}}>
					<Wrapped {...rest} />
				</MemoPropsChildrenContext.Provider>
			);
		} else {
			return (
				<MemoPropsContext.Provider value={{children, ...rest}}>
					<Wrapped {...rest} />
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
