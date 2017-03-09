import {Spotlight, SpotlightContainerDecorator} from '@enact/spotlight';
import React from 'react';

/**
 * Restores spotlight focus to root container when closing the container if the previously focused
 * component is contained.
 *
 * @class ExpandableContainerBase
 * @memberof moonstone/ExpandableItem
 * @private
 */
const ExpandableContainerBase = class extends React.Component {
	static displayName = 'ExpandableContainer'

	static propTypes =  /** @lends moonstone/ExpandableItem.ExpandableContainerBase.prototype */ {
		/**
		 * Set the spotlight container id of the Expandable control.
		 *
		 * @type {String}
		 * @default ''
		 * @public
		 * @memberof moonstone/ExpandableItem.ExpandableContainerBase.prototype
		 */
		'data-container-id': React.PropTypes.string,

		/**
		 * When `true`, the contents of the container will not receive spotlight focus when becoming
		 * expanded.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAutoFocus: React.PropTypes.bool,

		/**
		 * When `true` and used in conjunction with `noAutoFocus` when `false`, the contents of the
		 * container will receive spotlight focus expanded, even in pointer mode.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noPointerMode: React.PropTypes.bool,

		/**
		 * Set the open state of the component, which determines whether it's expanded or not.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		open: React.PropTypes.bool
	}

	static defaultProps = {
		noAutoFocus: false,
		noPointerMode: false
	}

	highlightContents = () => {
		if (this.containerNode.contains(document.activeElement)) {
			const contents = this.containerNode.querySelector('[data-expandable-container]');
			if (contents && !this.props.noAutoFocus) {
				Spotlight.focus(contents.dataset.containerId);
			}
		}
	}

	highlightLabeledItem = () => {
		if (this.containerNode.contains(document.activeElement)) {
			Spotlight.focus(this.props['data-container-id']);
		}
	}

	handleTransitionEnd = () => {
		const {noPointerMode, open} = this.props;
		const pointerMode = Spotlight.getPointerMode();
		const changePointerMode = pointerMode && (noPointerMode || !open);

		if (changePointerMode) {
			// we temporarily set pointer mode to `false` to ensure that focus is forced away
			// from the collapsing expandable.
			Spotlight.setPointerMode(false);
		}

		if (open) {
			this.highlightContents();
		} else {
			this.highlightLabeledItem();
		}

		if (changePointerMode) {
			Spotlight.setPointerMode(pointerMode);
		}
	}

	getContainerNode = (node) => {
		this.containerNode = node;
	}

	render () {
		const props = Object.assign({}, this.props);
		delete props.noAutoFocus;
		delete props.noPointerMode;

		return (
			<div
				{...props}
				onTransitionEnd={this.handleTransitionEnd}
				ref={this.getContainerNode}
			/>
		);
	}
};

/**
 * Restores spotlight focus to root container when closing the container if the previously focused
 * component is contained.
 *
 * @class ExpandableContainer
 * @memberof moonstone/ExpandableItem
 * @private
 */
const ExpandableContainer = SpotlightContainerDecorator(ExpandableContainerBase);

export default ExpandableContainer;
export {ExpandableContainer, ExpandableContainerBase};
