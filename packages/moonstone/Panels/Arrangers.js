import {scale, unit} from '@enact/ui/resolution';
import {arrange} from '@enact/ui/ViewManager/Arranger';

import {breadcrumbWidth} from './Breadcrumb';

const quadInOut = 'cubic-bezier(0.455, 0.030, 0.515, 0.955)';
const animationOptions = {easing: quadInOut};

// Always-Viewing Arranger

/**
 * Arranger that slides panels in from the right and out to the left
 *
 * @type {Arranger}
 * @private
 */
export const AlwaysViewingArranger = {
	enter: (config) => {
		const {reverse} = config;

		return arrange(config, [
			{transform: 'translateX(100%)', offset: 0},
			reverse ?
				{transform: 'translateX(0)', offset: 0.75} :
				{transform: 'translateX(100%)', offset: 0.25},
			{transform: 'translateX(0)', offset: 1}
		], animationOptions);
	},
	leave: (config) => {
		const {reverse} = config;

		return arrange(config, [
			{transform: 'translateX(0)', offset: 0},
			reverse ?
				{transform: 'translateX(-100%)', offset: 0.75} :
				{transform: 'translateX(0)', offset: 0.25},
			{transform: 'translateX(-100%)', offset: 1}
		], animationOptions);
	}
};

// Actvity Arranger

/*
 * Appends a transform that accounts for a single breadcrumb
 *
 * @param  {Node} node      DOM Node
 *
 * @returns {undefined}
 * @private
 */
const offsetForBreadcrumbs = (node) => {
	const isFirst = node && node.dataset && node.dataset.index === '0';

	return `translateX(${isFirst ? 0 : unit(scale(breadcrumbWidth), 'rem')})`;
};

// Adds the data-clip attribute to allow clipping when transitioning between non-zero panels
// CSS is enforced by Panels.module.less
const clipForBreadcrumbs = (node, to, from) => {
	const viewport = node.parentNode;

	if (to === 0 || from === 0) {
		// remove clip when moving to or from the first panel and when a transition is completing
		delete viewport.dataset.clip;
	} else {
		viewport.dataset.clip = 'true';
	}
};

/**
 * Arranger that slides panels in from the right and out to the left allowing space for the single
 * breadcrumb when `to` index is greater than zero.
 *
 * @type {Arranger}
 * @private
 */
export const ActivityArranger = {
	enter: (config) => {
		const {node, reverse, to, from} = config;

		clipForBreadcrumbs(node, to, from);

		return arrange(config, [
			{transform: `${offsetForBreadcrumbs(node)} translateX(100%)`, offset: 0},
			reverse ?
				{transform: offsetForBreadcrumbs(node), offset: 0.75} :
				{transform: `${offsetForBreadcrumbs(node)} translateX(100%)`, offset: 0.25},
			{transform: offsetForBreadcrumbs(node), offset: 1}
		], animationOptions);
	},
	leave: (config) => {
		const {node, reverse, to, from} = config;

		clipForBreadcrumbs(node, to, from);

		return arrange(config, [
			{transform: offsetForBreadcrumbs(node), offset: 0},
			reverse ?
				{transform: 'translateX(-100%)', offset: 0.75} :
				{transform: offsetForBreadcrumbs(node), offset: 0.25},
			{transform: 'translateX(-100%)', offset: 1}
		], animationOptions);
	},
	stay: (config) => {
		const {node} = config;

		return arrange(config, [
			{transform: offsetForBreadcrumbs(node)},
			{transform: offsetForBreadcrumbs(node)}
		], animationOptions);
	}
};
