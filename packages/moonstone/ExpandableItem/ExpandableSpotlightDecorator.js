import hoc from '@enact/core/hoc';
import Spotlight from '@enact/spotlight';
import React from 'react';
import PropTypes from 'prop-types';


/**
 * Default config for {@link mooonstone/ExpandableItem.ExpandableSpotlightDecorator
 *
 * @memberof moonstone/ExpandableItem.ExpandableSpotlightDecorator
 * @hocconfig
 * @private
 */
const defaultConfig = {
	/**
	 * When `true` and used in conjunction with `noAutoFocus` when `false`, the contents of the
	 * container will receive spotlight focus expanded, even in pointer mode.
	 *
	 * @type {Boolean}
	 * @default false
	 * @memberof moonstone/ExpandableItem.ExpandableSpotlightDecorator.defaultConfig
	 * @private
	 */
	noPointerMode: false
};

/**
 * Restores spotlight focus to root container when closing the container if the previously focused
 * component is contained.
 *
 * @class ExpandableSpotlightDecorator
 * @memberof moonstone/ExpandableItem
 * @private
 */
const ExpandableSpotlightDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {noPointerMode} = config;

	return class extends React.Component {
		static displayName = 'ExpandableSpotlightDecorator'

		static propTypes =  /** @lends moonstone/ExpandableItem.ExpandableSpotlightDecorator.prototype */ {
			/**
			 * When `true`, the contents of the container will not receive spotlight focus when becoming
			 * expanded.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			noAutoFocus: PropTypes.bool,

			/**
			 * Set the open state of the component, which determines whether it's expanded or not.
			 *
			 * @type {Boolean}
			 * @default true
			 * @public
			 */
			open: PropTypes.bool
		}

		static defaultProps = {
			noAutoFocus: false
		}

		highlightContents = () => {
			const current = Spotlight.getCurrent();
			if (this.containerNode.contains(current) || document.activeElement === document.body) {
				const contents = this.containerNode.querySelector('[data-expandable-container]');
				if (contents && !this.props.noAutoFocus && !contents.contains(current)) {
					Spotlight.focus(contents.dataset.containerId);
				}
			}
		}

		highlightLabeledItem = () => {
			const current = Spotlight.getCurrent();
			if (this.containerNode.contains(current)) {
				Spotlight.focus(this.containerNode.querySelector('[data-expandable-label]'));
			}
		}

		highlight = (callback) => {
			const {open} = this.props;
			const pointerMode = Spotlight.getPointerMode();
			const changePointerMode = pointerMode && (noPointerMode || !open);

			if (changePointerMode) {
				// we temporarily set pointer mode to `false` to ensure that focus is forced away
				// from the collapsing expandable.
				Spotlight.setPointerMode(false);
			}

			callback();

			if (changePointerMode) {
				Spotlight.setPointerMode(pointerMode);
			}
		}

		handleHide = () => {
			this.highlight(this.highlightLabeledItem);
		}

		handleShow = () => {
			this.highlight(this.highlightContents);
		}

		setContainerNode = (node) => {
			this.containerNode = node;
		}

		render () {
			const props = Object.assign({}, this.props);
			delete props.noAutoFocus;

			return (
				<Wrapped
					{...props}
					onHide={this.handleHide}
					onShow={this.handleShow}
					setContainerNode={this.setContainerNode}
				/>
			);
		}
	};
});

export default ExpandableSpotlightDecorator;
export {
	ExpandableSpotlightDecorator
};
