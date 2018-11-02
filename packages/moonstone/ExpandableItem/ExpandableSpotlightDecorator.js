import {getContainersForNode, getContainerNode, setContainerLastFocusedElement} from '@enact/spotlight/src/container';
import {forward, handle} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import Spotlight from '@enact/spotlight';
import Pause from '@enact/spotlight/Pause';
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

/**
 * Default config for {@link mooonstone/ExpandableItem.ExpandableSpotlightDecorator}
 *
 * @memberof moonstone/ExpandableItem.ExpandableSpotlightDecorator
 * @hocconfig
 * @private
 */
const defaultConfig = {
	/**
	 * Returns the child -- either a node or a CSS selector -- to focus after expanding.
	 *
	 * If this function is defined, it will be passed the container node and the current set of
	 * props and should return either a node or a CSS selector to be passed to
	 * {@link spotlight/Spotlight.focus}.
	 *
	 * @type {Function}
	 * @default null
	 * @memberof moonstone/ExpandableItem.ExpandableSpotlightDecorator.defaultConfig
	 * @private
	 */
	getChildFocusTarget: null,

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
	const {getChildFocusTarget, noPointerMode} = config;

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

		constructor () {
			super();

			this.paused = new Pause('ExpandableItem');
		}

		componentWillUnmount () {
			this.resume();
		}

		highlightContents = () => {
			const current = Spotlight.getCurrent();
			if (this.containerNode.contains(current) || document.activeElement === document.body) {
				const contents = this.containerNode.querySelector('[data-expandable-container]');
				if (contents && !this.props.noAutoFocus && !contents.contains(current)) {
					let focused = false;

					// Attempt to retrieve the Expandable-configured child focus target
					if (getChildFocusTarget) {
						const selectedNode = getChildFocusTarget(contents, this.props);

						if (selectedNode) {
							focused = Spotlight.focus(selectedNode);
						}
					}

					if (!focused) {
						Spotlight.focus(contents.dataset.spotlightId);
					}
				}
			}
		}

		highlightLabeledItem = () => {
			const current = Spotlight.getCurrent();
			const label = this.containerNode.querySelector('[data-expandable-label]');

			if (current === label) return;

			if (this.containerNode.contains(current)) {
				if (Spotlight.getPointerMode()) {
					// If we don't clear the focus, switching back to 5-way before focusing anything
					// will result in what appears to be lost focus
					current.blur();
				}

				Spotlight.focus(label);
			} else {
				let containerIds = getContainersForNode(label);

				// when focus is not within the expandable (due to a cancel event or the close
				// on blur from ExpandableInput, or some quick key presses), we need to fix the last
				// focused element config so that focus can be restored to the label rather than
				// spotlight getting lost.
				//
				// If there is focus or active container somewhere else, then we only need to fix
				// the nearest containers to the label that arent also containing the currently
				// focused element.
				const node = current || Spotlight.getPointerMode() && getContainerNode(Spotlight.getActiveContainer());
				if (node) {
					const ids = getContainersForNode(node);
					containerIds = containerIds.filter((id) => !ids.includes(id));
				}

				setContainerLastFocusedElement(label, containerIds);
			}
		}

		highlight = (callback) => {
			if (Spotlight.isPaused()) return;

			const pointerMode = Spotlight.getPointerMode();
			const changePointerMode = pointerMode && noPointerMode;

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


		pause = () => {
			this.paused.pause();
		}

		resume = () => {
			this.paused.resume();
		}

		handleHide = () => {
			this.resume();
			this.highlight(this.highlightLabeledItem);
		}

		handle = handle.bind(this)

		handleClose = this.handle(
			forward('onClose'),
			this.pause
		)

		handleOpen = this.handle(
			forward('onOpen'),
			this.pause
		)

		handleShow = () => {
			this.resume();
			this.highlight(this.highlightContents);
		}

		setContainerNode = (node) => {
			this.containerNode = ReactDOM.findDOMNode(node);	// eslint-disable-line react/no-find-dom-node
		}

		render () {
			const props = Object.assign({}, this.props);
			delete props.noAutoFocus;

			return (
				<Wrapped
					{...props}
					onHide={this.handleHide}
					onShow={this.handleShow}
					onOpen={this.handleOpen}
					onClose={this.handleClose}
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
