import {Spotlight, SpotlightContainerDecorator} from '@enact/spotlight';
import React from 'react';

/**
 * Restores spotlight focus to root container when closing the container if the previously focused
 * component is contained.
 *
 * @class ExpandableContainer
 * @private
 */

const ExpandableContainerBase = class extends React.Component {
	static displayName = 'ExpandableContainer'

	static propTypes = {
		'data-container-id': React.PropTypes.string,
		open: React.PropTypes.bool
	}

	componentDidUpdate (prevProps) {
		if (!this.props.open && prevProps.open) {
			this.highlightLabeledItem();
		}
	}

	highlightLabeledItem = () => {
		if (this.containerNode.contains(document.activeElement)) {
			Spotlight.focus(this.props['data-container-id']);
		}
	}

	getContainerNode = (node) => {
		this.containerNode = node;
	}

	render () {
		return (
			<div {...this.props} ref={this.getContainerNode} />
		);
	}
};

const ExpandableContainer = SpotlightContainerDecorator(ExpandableContainerBase);

export default ExpandableContainer;
export {ExpandableContainer, ExpandableContainerBase};
