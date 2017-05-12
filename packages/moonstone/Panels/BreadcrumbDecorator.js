import {coerceFunction} from '@enact/core/util';
import hoc from '@enact/core/hoc';
import invariant from 'invariant';
import kind from '@enact/core/kind';
import ViewManager from '@enact/ui/ViewManager';
import React from 'react';
import PropTypes from 'prop-types';

import Breadcrumb from './Breadcrumb';
import BreadcrumbArranger from './BreadcrumbArranger';
import CancelDecorator from './CancelDecorator';
import IdProvider from './IdProvider';
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
	 * Arranger for Panels
	 *
	 * @type {object}
	 * @default null
	 * @memberof moonstone/Panels.BreadcrumbDecorator.defaultConfig
	 */
	panelArranger: null
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
	const {max, panelArranger, className: cfgClassName} = config;
	const calcMax = coerceFunction(max);

	const Decorator = kind({
		name: 'BreadcrumbDecorator',

		propTypes: /** @lends moonstone/Panels.BreadcrumbDecorator.prototype */ {
			/**
			 * Array of breadcrumbs or a function that generates an array of breadcrumbs
			 *
			 * @type {Function|node[]}
			 * @default IndexedBreadcrumbs
			 */
			breadcrumbs: PropTypes.oneOfType([
				PropTypes.func,							// generator
				PropTypes.arrayOf(PropTypes.node)	// static array of breadcrumbs
			]),

			/**
			 * Panels to be rendered
			 *
			 * @type {Node}
			 */
			children: PropTypes.node,

			generateId: PropTypes.func,

			id: PropTypes.string,

			/**
			 * Index of the active panel
			 *
			 * @type {Number}
			 * @default 0
			 */
			index: PropTypes.number,

			/**
			 * Disable breadcrumb transitions
			 *
			 * @type {Boolean}
			 * @default false
			 */
			noAnimation: PropTypes.bool,

			/**
			 * Handler called when a breadcrumb is clicked. The payload includes the `index` of the
			 * selected breadcrumb
			 *
			 * @type {Function}
			 */
			onSelectBreadcrumb: PropTypes.func
		},

		defaultProps: {
			breadcrumbs: IndexedBreadcrumbs,
			index: 0,
			noAnimation: false
		},

		styles: {
			css,
			className: cfgClassName
		},

		computed: {
			// Invokes the breadcrumb generator, if provided
			breadcrumbs: ({breadcrumbs, id, index, onSelectBreadcrumb}) => {
				const x = calcMax(index);
				if (Array.isArray(breadcrumbs)) {
					// limit the number of breadcrumbs based on the index and config.max
					const start = Math.max(index - x, 0);
					const children = React.Children.toArray(breadcrumbs).slice(start, start + x);

					// map over the children to either clone it with the appropriate props or to
					// create a Breadcrumb if passed an array of renderable primitives
					return React.Children.map(children, (child, i) => {
						const props = {
							id: `${id}_bc_${i}`,
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
					return breadcrumbs(id, index, x, onSelectBreadcrumb);
				}
			},
			viewProps: ({id, index}) => {
				const breadcrumbs = [];
				for (let i = 0, x = calcMax(index); i < x; i++) {
					breadcrumbs.push(`${id}_bc_${i}`);
				}

				return {
					'aria-owns': breadcrumbs.join(' ')
				};
			}
		},

		render: ({breadcrumbs, children, className, generateId, id, index, noAnimation, ...rest}) => {
			delete rest.onSelectBreadcrumb;

			const count = React.Children.count(children);
			invariant(
				index === 0 && count === 0 || index < count,
				`Panels index, ${index}, is invalid for number of children, ${count}`
			);

			return (
				<div className={className} data-index={index} id={id}>
					<ViewManager
						arranger={BreadcrumbArranger}
						className={css.breadcrumbs}
						duration={300}
						end={calcMax()}
						index={index - 1}
						noAnimation={noAnimation}
						start={0}
					>
						{breadcrumbs}
					</ViewManager>
					<Wrapped
						{...rest}
						arranger={panelArranger}
						generateId={generateId}
						id={`${id}_panels`}
						index={index}
						noAnimation={noAnimation}

					>
						{children}
					</Wrapped>
				</div>
			);
		}
	});

	return CancelDecorator(
		{cancel: 'onSelectBreadcrumb'},
		IdProvider(
			Decorator
		)
	);
});

export default BreadcrumbDecorator;
export {BreadcrumbDecorator};
