import {Spotlight, SpotlightContainerDecorator} from '@enact/spotlight';
import React from 'react';

class ExpandableContainerComponent extends React.Component {
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
		return (<div {...this.props} ref={this.getContainerNode} />)
	}
}

const ExpandableContainer = SpotlightContainerDecorator(ExpandableContainerComponent);

export default ExpandableContainer;
export {ExpandableContainer};
