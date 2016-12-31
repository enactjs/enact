import {kind, hoc} from '@enact/core';
import {coerceFunction} from '@enact/core/util';
import ViewManager from '@enact/ui/ViewManager';
import invariant from 'invariant';
import React from 'react';

import Breadcrumb from './Breadcrumb';
import BreadcrumbArranger from './BreadcrumbArranger';
import CancelDecorator from './CancelDecorator';
import IndexedBreadcrumbs from './IndexedBreadcrumbs';

import css from './Panels.less';

// TODO: Figure out how to document private sub-module members

/**
 * Default config for {@link moonstone/Panels.BreadcrumbDecorator}
 * @hocconfig
 * @memberof moonstone/Panels.BreadcrumbDecorator
 */
const defaultConfig = {
	/**
	 * Classes to be added to the root node
	 *
	 * @type {string}
	 * @default null
	 * @memberof moonstone/Panels.BreadcrumbDecorator.defaultConfig
	 */
	className: null,

	/**
	 * Maximum number of breadcrumbs to display. If a function, it will be called on render to
	 * calculate the number of breadcrumbs
	 *
	 * @type {number|function}
	 * @default 0
	 * @memberof moonstone/Panels.BreadcrumbDecorator.defaultConfig
	 */
	max: 0,

	/**
	 * Static props to apply to the wrapped component which supercede any waterfalled props
	 *
	 * @type {object}
	 * @default null
	 * @memberof moonstone/Panels.BreadcrumbDecorator.defaultConfig
	 */
	props: null
};


/**
 * Higher-order Component that adds breadcrumbs to a Panels component
 *
 * @class BreadcrumbDecorator
 * @type {Function}
 * @hoc
 * @private
 * @memberof moonstone/Panels
 */
const BreadcrumbDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const max = coerceFunction(config.max);

	const Decorator = kind({
		name: 'BreadcrumbDecorator',

		propTypes: /** @lends moonstone/Panels.BreadcrumbDecorator.prototype */ {
			/**
			 * Array of breadcrumbs or a function that generates an array of breadcrumbs
			 *
			 * @type {Function|node[]}
			 * @default IndexedBreadcrumbs
			 */
			breadcrumbs: React.PropTypes.oneOfType([
				React.PropTypes.func,							// generator
				React.PropTypes.arrayOf(React.PropTypes.node)	// static array of breadcrumbs
			]),

			/**
			 * Panels to be rendered
			 *
			 * @type {React.node}
			 */
			children: React.PropTypes.node,

			/**
			 * Index of the active panel
			 *
			 * @type {Number}
			 * @default 0
			 */
			index: React.PropTypes.number,

			/**
			 * Disable breadcrumb transitions
			 *
			 * @type {Boolean}
			 * @default false
			 */
			noAnimation: React.PropTypes.bool,

			/**
			 * Handler called when a breadcrumb is clicked. The payload includes the `index` of the
			 * selected breadcrumb
			 *
			 * @type {Function}
			 */
			onSelectBreadcrumb: React.PropTypes.func
		},

		defaultProps: {
			breadcrumbs: IndexedBreadcrumbs,
			index: 0,
			noAnimation: false
		},

		styles: {
			css,
			className: config.className
		},

		computed: {
			// Invokes the breadcrumb generator, if provided
			breadcrumbs: ({breadcrumbs, index, onSelectBreadcrumb}) => {
				const x = max();
				if (Array.isArray(breadcrumbs)) {
					// limit the number of breadcrumbs based on the index and config.max
					const start = Math.max(index - x, 0);
					const children = React.Children.toArray(breadcrumbs).slice(start, start + x);

					// map over the children to either clone it with the appropriate props or to
					// create a Breadcrumb if passed an array of renderable primitives
					return React.Children.map(children, (child, i) => {
						const props = {
							index: i,
							onSelect: onSelectBreadcrumb
						};

						if (React.isValidElement(child)) {
							return React.cloneElement(child, props);
						} else {
							return React.createElement(Breadcrumb, props, child);
						}
					});
				} else {
					return breadcrumbs(index, x, onSelectBreadcrumb);
				}
			}
		},

		render: ({noAnimation, breadcrumbs, children, className, index, ...rest}) => {
			delete rest.onSelectBreadcrumb;

			const count = React.Children.count(children);
			invariant(
				index === 0 && count === 0 || index < count,
				`Panels index, ${index}, is invalid for number of children, ${count}`
			);

			return (
				<div className={className}>
					<ViewManager
						noAnimation={noAnimation}
						arranger={BreadcrumbArranger}
						className={css.breadcrumbs}
						index={index - 1}
						duration={300}
						start={0}
						end={max()}
					>
						{breadcrumbs}
					</ViewManager>
					<Wrapped {...rest} noAnimation={noAnimation} index={index} {...config.props}>
						{children}
					</Wrapped>
				</div>
			);
		}
	});

	return CancelDecorator(
		{cancel: 'onSelectBreadcrumb'},
		Decorator
	);
});

export default BreadcrumbDecorator;
export {BreadcrumbDecorator};
