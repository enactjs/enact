import Spotlight, {spottableClass} from '@enact/spotlight';
import React, {PropTypes} from 'react';

/**
 * The focus manager for a set of Panels
 *
 * @class FocusManager
 * @private
 */
class FocusManagerBase extends React.Component {
	static displayName = 'FocusManager';

	static propTypes = {
		/**
		 * Index of the active panel
		 *
		 * @type {Number}
		 * @default 0
		 */
		index: PropTypes.number
	}

	componentDidUpdate (prevProps) {
		if (prevProps.index !== this.props.index && this.node.contains(document.activeElement)) {
			const spotlightClass = '.' + spottableClass;
			const activePanel = this.node.querySelector('article');

			// we prioritize what area to spot next. if spottable controls are available in the active panel, we
			// want to spot the content (`<section>`) first, followed by any spottable control in the panel
			// itself (including possible `<Header>` controls), followed by any spottable control contained within
			// the panel decorators - including possible breadcrumbs or an existing `noCloseButton`.
			const spottable = activePanel.querySelector('section ' + spotlightClass) || activePanel.querySelector(spotlightClass) || this.node.querySelector(spotlightClass);
			if (spottable) {
				Spotlight.focus(spottable);
			}
		}
	}

	getNode = (node) => {
		this.node = node;
	}

	render () {
		const props = Object.assign({}, this.props);
		delete props.index;

		return (
			<div {...props} ref={this.getNode} />
		);
	}
}

export default FocusManagerBase;
export {FocusManagerBase as FocusManager};
