import {kind, hoc} from 'enyo-core';
import {coerceFunction} from 'enyo-core/util';
import ViewManager from 'enyo-ui/ViewManager';
import React from 'react';

import Breadcrumb from './Breadcrumb';
import BreadcrumbArranger from './BreadcrumbArranger';
import IndexedBreadcrumbs from './IndexedBreadcrumbs';

import css from './Panels.less';

const defaultConfig = {
	/**
	 * Classes to be added to the root node
	 *
	 * @type {string}
	 * @default null
	 */
	classes: null,

	/**
	 * Maximum number of breadcrumbs to display. If a function, it will be called on render to
	 * calculate the number of breadcrumbs
	 *
	 * @type {number|function}
	 * @default 0
	 */
	max: 0,

	/**
	 * Static props to apply to the wrapped component which supercede any waterfalled props
	 *
	 * @type {object}
	 * @default null
	 */
	props: null
};


/**
 * Higher-order Component that adds breadcrumbs to a Panels component
 *
 * @type {Function}
 */
const BreadcrumbDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const max = coerceFunction(config.max);

	const Decorator = kind({
		name: 'BreadcrumbDecorator',

		propTypes: {
			/**
			 * Breadcrumb transitions will be animated when `true`
			 *
			 * @type {Boolean}
			 * @default true
			 */
			animate: React.PropTypes.bool,

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
			 * Index of the active panel
			 *
			 * @type {Number}
			 * @default 0
			 */
			index: React.PropTypes.number,

			/**
			 * Handler called when a breadcrumb is clicked. The payload includes the `index` of the
			 * selected breadcrumb
			 *
			 * @type {Function}
			 */
			onSelectBreadcrumb: React.PropTypes.func
		},

		defaultProps: {
			animate: true,
			breadcrumbs: IndexedBreadcrumbs,
			index: 0
		},

		styles: {
			css,
			classes: config.classes
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

		render: ({animate, breadcrumbs, classes, index, ...rest}) => {
			delete rest.onSelectBreadcrumb;

			return (
				<div className={classes}>
					<ViewManager
						animate={animate}
						arranger={BreadcrumbArranger}
						className={css.breadcrumbs}
						index={index - 1}
						duration={300}
						start={0}
						end={max()}
					>
						{breadcrumbs}
					</ViewManager>
					<Wrapped {...rest} animate={animate} index={index} {...config.props} />
				</div>
			);
		}
	});

	return Decorator;
});

export default BreadcrumbDecorator;
export {BreadcrumbDecorator};
