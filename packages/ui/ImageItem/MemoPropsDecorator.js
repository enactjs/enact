import hoc from '@enact/core/hoc';
import pick from 'ramda/src/pick';
import omit from 'ramda/src/omit';
import React from 'react';

const MemoPropsThemeContext = React.createContext();
const MemoPropsContext = React.createContext();

/**
 * Default config for `MemoPropsDecorator`.
 *
 * @memberof ui/ImageItem.MemoPropsDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * Array of the props passed throught a context.
	 *
	 * @type {String[]}
	 * @default	[]
	 * @private
	 * @memberof  ui/ImageItem.MemoPropsDecorator.defaultConfig
	 */
	filter: []
};

/**
 * A higher-order component that is used to provide a context provider.
 * The props which keys are defined in the array of the `filter` config,
 * will be passed through a context. The other props will be passed
 * as props.
 *
 * @class MemoPropsDecorator
 * @memberof ui/ImageItem
 * @hoc
 * @public
 */
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

/**
 * A higher-order component that is used to provide a context provider.
 * All the props will be passed through a context and will be passed as props.
 *
 * There are no configurable options on this HOC.
 *
 * @class MemoPropsThemeDecorator
 * @memberof ui/ImageItem
 * @hoc
 * @public
 */
const MemoPropsThemeDecorator = hoc((config, Wrapped) => {
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
