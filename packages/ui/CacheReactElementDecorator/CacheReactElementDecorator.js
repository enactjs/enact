/**
 * caches React elements, but allows context values to re-render.
 *
 * @module ui/CacheReactElementContext
 * @exports CacheReactElementContext
 */

import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';
import omit from 'ramda/src/omit';
import pick from 'ramda/src/pick';
import React from 'react';

const CacheReactElementContext = React.createContext();

const CacheReactElementWithChildrenContextDecorator = (property) => {
	// eslint-disable-next-line no-shadow
	function CacheReactElementWithChildrenContextDecorator ({children}) {
		const context = React.useContext(CacheReactElementContext);

		return context && context[property] || children;
	}

	return CacheReactElementWithChildrenContextDecorator;
};

/**
 * A higher-order component that pass context as render props
 *
 * Example:
 * ```
 * return (
 * 	<CacheReactElementWithPropContext {...rest}>
 * 		{(props) => (<UiImageItem {...props})}
 * 	</CacheReactElementWithPropContext>
 * );
 * ```
 *
 * @class CacheReactElementWithPropContext
 * @memberof ui/CacheReactElementDecorator
 * @hoc
 * @private
 */
const CacheReactElementWithPropContext = ({filterProps}) => {
	// eslint-disable-next-line no-shadow
	function CacheReactElementWithPropContext ({cached, children}) {
		if (cached) {
			return (
				<CacheReactElementContext.Consumer>
					{(props) => {
						const cachedProps = pick(filterProps, props);
						return children ? children(cachedProps) : null;
					}}
				</CacheReactElementContext.Consumer>
			);
		} else {
			return children && typeof children === 'function' ? children({}) : null;
		}
	}

	CacheReactElementWithPropContext.propTypes = /** @lends sandstone/ImageItem.CacheReactElementWithPropContext.prototype */ {
		/**
		 * Cache React elements.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		cached: PropTypes.bool
	};

	CacheReactElementWithPropContext.defaultProps = {
		cached: true
	};

	return CacheReactElementWithPropContext;
};

const defaultWithPropConfig = {
	filterProps: []
};

const CacheReactElementWithPropContextDecorator = hoc(defaultWithPropConfig, (config, Wrapped) => {
	const {filterProps} = config;

	// eslint-disable-next-line no-shadow
	function CacheReactElementWithPropContextDecorator ({cached, ...rest}) {
		const cachedContext = React.useContext(CacheReactElementContext);
		if (cached) {
			const cachedProps = pick(filterProps, cachedContext);
			return <Wrapped {...rest} {...cachedProps} />;
		} else {
			return <Wrapped {...rest} />;
		}
	}

	CacheReactElementWithPropContextDecorator.propTypes = /** @lends sandstone/ImageItem.CacheReactElementWithPropContextDecorator.prototype */ {
		/**
		 * Cache React elements.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		cached: PropTypes.bool
	};

	CacheReactElementWithPropContextDecorator.defaultProps = {
		cached: true
	};

	return CacheReactElementWithPropContextDecorator;
});

/**
 * Default config for `CacheReactElementDecorator`.
 *
 * @memberof ui/ImageItem.CacheReactElementDecorator
 * @hocconfig
 * @private
 */
const defaultConfig = {
	/**
	 * The array includes the key strings of the context object
	 * which will be used as children prop.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	filterChildren: []
};

/**
 * A higher-order component that caches React elements, but allows context values to re-render.
 *
 * Example:
 * ```
 * const ImageItemDecorator = compose(
 * 	CacheReactElementDecorator({filterChildren: ['children', 'label']}),
 * 	MarqueeController({marqueeOnFocus: true}),
 * 	Spottable,
 * 	Skinnable
 * );
 * ```
 *
 * @class CacheReactElementDecorator
 * @memberof ui/ImageItem
 * @hoc
 * @private
 */
const CacheReactElementDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {filterChildren} = config;

	// eslint-disable-next-line no-shadow
	function CacheReactElementDecorator ({cached, ...rest}) {
		const element = React.useRef(null);

		if (!cached) {
			return <Wrapped {...rest} />;
		}

		const cachedProps = {};
		const pickProps = pick(filterChildren, rest);
		const updatedProps = omit(filterChildren, rest);

		for (const key in pickProps) {
			const CachedContextProp = CacheReactElementWithChildrenContextDecorator(key);
			cachedProps[key] = <CachedContextProp>{rest[key]}</CachedContextProp>;
		}

		element.current = element.current || (
			<Wrapped
				{...cachedProps}
				{...updatedProps}
				cached={cached}
			/>
		);

		return (
			<CacheReactElementContext.Provider value={rest}>
				{element.current}
			</CacheReactElementContext.Provider>
		);
	}

	CacheReactElementDecorator.propTypes = /** @lends sandstone/ImageItem.CacheReactElementDecorator.prototype */ {
		/**
		 * Cache React elements.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		cached: PropTypes.bool
	};

	CacheReactElementDecorator.defaultProps = {
		cached: true
	};

	return CacheReactElementDecorator;
});

export default CacheReactElementDecorator;
export {
	CacheReactElementContext,
	CacheReactElementDecorator,
	CacheReactElementWithChildrenContextDecorator,
	CacheReactElementWithPropContext,
	CacheReactElementWithPropContextDecorator
};
