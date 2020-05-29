/**
 * Use cached React elements, but allows props to be updated with a context.
 *
 * @module ui/CacheReactElementContext
 * @exports CacheReactElementContext
 */

import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';
import omit from 'ramda/src/omit';
import pick from 'ramda/src/pick';
import React from 'react';
import ReactDOM from 'react-dom';

const CacheReactElementContext = React.createContext();

/**
 * A higher-order component that passes context as children props.
 *
 * Example:
 * ```
 * const CachedContextProp = CacheReactElementAndUpdateChildrenContextDecorator(key);
 *
 * return (
 * 	<CachedContextProp>{props[key]}</CachedContextProp>;
 * );
 * ```
 *
 * @class CacheReactElementAndUpdatePropsContext
 * @memberof ui/CacheReactElementDecorator
 * @hoc
 * @private
 */
const CacheReactElementAndUpdateChildrenContextDecorator = (property) => {
	// eslint-disable-next-line no-shadow
	function CacheReactElementAndUpdateChildrenContextDecorator ({children}) {
		const context = React.useContext(CacheReactElementContext);

		return context && context[property] || children;
	}

	return CacheReactElementAndUpdateChildrenContextDecorator;
};

/**
 * A higher-order component that passes context as render prop pattern's props.
 *
 * Example:
 * ```
 * return (
 * 	<CacheReactElementAndUpdatePropsContext {...rest}>
 * 		{(props) => (<UiImageItem {...props})}
 * 	</CacheReactElementAndUpdatePropsContext>
 * );
 * ```
 *
 * @class CacheReactElementAndUpdatePropsContext
 * @memberof ui/CacheReactElementDecorator
 * @hoc
 * @private
 */
const CacheReactElementAndUpdatePropsContext = ({filterProps} = {filterProps: []}) => {
	// eslint-disable-next-line no-shadow
	function CacheReactElementAndUpdatePropsContext ({cached, children}) {
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

	CacheReactElementAndUpdatePropsContext.propTypes = /** @lends sandstone/CacheReactElementDecorator.CacheReactElementAndUpdatePropsContext.prototype */ {
		/**
		 * Cache React elements.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		cached: PropTypes.bool
	};

	CacheReactElementAndUpdatePropsContext.defaultProps = {
		cached: true
	};

	return CacheReactElementAndUpdatePropsContext;
};

const defaultWithPropConfig = {
	/**
	 * The array includes the key strings of the context object
	 * which will be used as props.
	 *
	 * @type {Array}
	 * @default []
	 * @public
	 */
	filterProps: []
};

/**
 * A higher-order component that passes context as props.
 *
 * Example:
 * ```
 * const ContextComponent = cached ? CacheReactElementAndUpdatePropsContextDecorator({filterProps: ['data-index', 'src']})(Component) : Component;
 *
 * return (
 * 	<ContextComponent {...rest} cached={cached} >
 * 		<div />
 * 	</ContextComponent>
 * );
 * ```
 *
 * @class CacheReactElementAndUpdatePropsContextDecorator
 * @memberof ui/CacheReactElementDecorator
 * @hoc
 * @private
 */
const CacheReactElementAndUpdatePropsContextDecorator = hoc(defaultWithPropConfig, (config, Wrapped) => {
	const {filterProps} = config;

	// eslint-disable-next-line no-shadow
	function CacheReactElementAndUpdatePropsContextDecorator ({cached, ...rest}) {
		const cachedContext = React.useContext(CacheReactElementContext);
		if (cached) {
			const cachedProps = pick(filterProps, cachedContext);
			return <Wrapped {...rest} {...cachedProps} />;
		} else {
			return <Wrapped {...rest} />;
		}
	}

	CacheReactElementAndUpdatePropsContextDecorator.propTypes = /** @lends sandstone/CacheReactElementDecorator.CacheReactElementAndUpdatePropsContextDecorator.prototype */ {
		/**
		 * Cache React elements.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		cached: PropTypes.bool
	};

	CacheReactElementAndUpdatePropsContextDecorator.defaultProps = {
		cached: true
	};

	return CacheReactElementAndUpdatePropsContextDecorator;
});

/**
 * A higher-order component that passes context to DOM attributes.
 *
 * Example:
 * ```
 * const ContextComponent = cached ? CacheReactElementAndUpdateDOMAttributesContextDecorator({filterProps: ['data-index', 'src']})(Component) : Component;
 *
 * return (
 * 	<ContextComponent {...rest} cached={cached} >
 * 		<div />
 * 	</ContextComponent>
 * );
 * ```
 *
 * @class CacheReactElementAndUpdateDOMAttributesContextDecorator
 * @memberof ui/CacheReactElementDecorator
 * @hoc
 * @private
 */
const CacheReactElementAndUpdateDOMAttributesContextDecorator = hoc(defaultWithPropConfig, (config, Wrapped) => {
	const {filterProps} = config;

	// eslint-disable-next-line no-shadow
	return class CacheReactElementAndUpdateDOMAttributesContextDecorator extends React.Component {
		static propTypes = /** @lends sandstone/CacheReactElementDecorator.CacheReactElementAndUpdateDOMAttributesContextDecorator.prototype */ {
			/**
			 * Cache React elements.
			 *
			 * @type {Boolean}
			 * @default true
			 * @public
			 */
			cached: PropTypes.bool
		}

		static defaultProps = {
			cached: true
		}

		componentDidMount () {
			this.updateDOMAttributes();
		}

		node = null

		cachedProps = {}

		cachedChildren = null

		updateDOMAttributes () {
			this.node = this.node || ReactDOM.findDOMNode(this); // eslint-disable-line react/no-find-dom-node

			if (this.node) {
				for (const prop in this.cachedProps) {
					this.node.setAttribute(prop, this.cachedProps[prop]);
				}
			}
		}

		render () {
			const {cached, ...rest} = this.props;

			if (cached) {
				return (
					<CacheReactElementContext.Consumer>
						{(context) => {
							this.cachedProps = pick(filterProps, context);
							this.cachedChildren = this.cachedChildren || <Wrapped {...rest} />;
							this.updateDOMAttributes();

							return this.cachedChildren;
						}}
					</CacheReactElementContext.Consumer>
				);
			} else {
				return <Wrapped {...rest} />;
			}
		}
	};
});

/**
 * Default config for `CacheReactElementDecorator`.
 *
 * @memberof ui/CacheReactElementDecorator.CacheReactElementDecorator
 * @hocconfig
 * @private
 */
const defaultConfig = {
	/**
	 * The array includes the key strings of the context object
	 * which will be used as children prop.
	 *
	 * @type {Array}
	 * @default []
	 * @public
	 */
	filterChildren: []
};

/**
 * A higher-order component that use cached React elements, but allows props to be updated with a context.
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
 * @memberof ui/CacheReactElementDecorator
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
			const CachedContextProp = CacheReactElementAndUpdateChildrenContextDecorator(key);
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

	CacheReactElementDecorator.propTypes = /** @lends sandstone/CacheReactElementDecorator.CacheReactElementDecorator.prototype */ {
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
	CacheReactElementAndUpdateChildrenContextDecorator,
	CacheReactElementAndUpdateDOMAttributesContextDecorator,
	CacheReactElementAndUpdatePropsContext,
	CacheReactElementAndUpdatePropsContextDecorator,
	CacheReactElementContext,
	CacheReactElementDecorator
};
