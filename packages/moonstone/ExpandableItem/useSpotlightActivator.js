import {getContainersForNode, getContainerNode, setContainerLastFocusedElement} from '@enact/spotlight/src/container';
import {handle} from '@enact/core/handle';
import Spotlight from '@enact/spotlight';
import {usePause} from '@enact/spotlight/Pause';
import React from 'react';
import ReactDOM from 'react-dom';

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
function configureSpotlightActivator (config) {
	const {getChildFocusTarget, noPointerMode} = {...defaultConfig, ...config};

	function highlightContents (containerNode, props) {
		const current = Spotlight.getCurrent();
		if (containerNode.contains(current) || document.activeElement === document.body) {
			const contents = containerNode.querySelector('[data-expandable-container]');
			if (contents && !props.noAutoFocus && !contents.contains(current)) {
				let focused = false;

				// Attempt to retrieve the Expandable-configured child focus target
				if (getChildFocusTarget) {
					const selectedNode = getChildFocusTarget(contents, props);

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

	function highlightLabeledItem (containerNode) {
		const current = Spotlight.getCurrent();
		const label = containerNode.querySelector('[data-expandable-label]');

		if (current === label) return;

		if (containerNode.contains(current)) {
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

	function highlight (callback) {
		return (ev, props, context) => {
			if (Spotlight.isPaused()) return;

			const pointerMode = Spotlight.getPointerMode();
			const changePointerMode = pointerMode && noPointerMode;

			if (changePointerMode) {
				// we temporarily set pointer mode to `false` to ensure that focus is forced away
				// from the collapsing expandable.
				Spotlight.setPointerMode(false);
			}

			// TODO: Fix ExpandableItem pass this to the native node
			// eslint-disable-next-line react/no-find-dom-node
			callback(ReactDOM.findDOMNode(context.containerNode.current), props);

			if (changePointerMode) {
				Spotlight.setPointerMode(pointerMode);
			}
		};
	}

	const handlePause = (ev, props, {paused}) => paused.pause();
	const handleResume = (ev, props, {paused}) => paused.resume();

	const handleHide = handle(
		handleResume,
		highlight(highlightLabeledItem)
	);

	const handleClose = handle(
		handlePause
	);

	const handleOpen = handle(
		handlePause
	);

	const handleShow = handle(
		handleResume,
		highlight(highlightContents)
	);

	// eslint-disable-next-line no-shadow
	return function useSpotlightActivator (props) {
		const paused = usePause('useSpotlightActivator');
		const containerNode = React.useRef(null);

		const context = {
			paused,
			containerNode
		};

		return {
			onHide: (ev) => handleHide(ev, props, context),
			onShow: (ev) => handleShow(ev, props, context),
			onOpen: (ev) => handleOpen(ev, props, context),
			onClose: (ev) => handleClose(ev, props, context),
			setContainerNode: containerNode
		};
	};
}

const useSpotlightActivator = configureSpotlightActivator();
useSpotlightActivator.config = configureSpotlightActivator;

export default useSpotlightActivator;
export {
	configureSpotlightActivator,
	defaultConfig,
	useSpotlightActivator
};
