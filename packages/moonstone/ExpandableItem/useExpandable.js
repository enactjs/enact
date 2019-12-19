import {configureCancel} from '@enact/ui/Cancelable';
import {configureRadio} from '@enact/ui/RadioDecorator';
import {configureToggle} from '@enact/ui/Toggleable';

import useDeferChildren from './useDeferChildren';
import {configureSpotlightActivator} from './useSpotlightActivator';

// TODO: This module may not doc correctly but we'll need to wait until our doc parsing script is
// ready

/**
 * Called by {@link ui/Cancelable.Cancelable} when a cancel event occurs and calls the
 * `onClose` handler provided by the wrapping Toggleable HOC.
 *
 * @param  {Object} props Current props object
 *
 * @returns {undefined}
 * @private
 */
const handleCancel = function (ev, props) {
	if (props.open) {
		props.onClose();
		ev.stopPropagation();
	}
};

/**
 * Default config for {@link moonstone/ExpandableItem.Expandable}.
 *
 * @memberof moonstone/ExpandableItem.Expandable
 * @hocconfig
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
	 * @memberof moonstone/ExpandableItem.Expandable.defaultConfig
	 * @private
	 */
	getChildFocusTarget: null,

	/**
	 * When `true` and used in conjunction with `noAutoFocus` when `false`, the contents of the
	 * container will receive spotlight focus expanded, even in pointer mode.
	 *
	 * @type {Boolean}
	 * @default false
	 * @memberof moonstone/ExpandableItem.Expandable.defaultConfig
	 * @public
	 */
	noPointerMode: false
};

/**
 * A higher-order component that manages the open state of a component and adds {@link ui/Cancelable.Cancelable}
 * support to call the `onClose` handler on
 * cancel.
 *
 * @class Expandable
 * @memberof moonstone/ExpandableItem
 * @mixes ui/Toggleable.Toggleable
 * @mixes ui/RadioDecorator.RadioDecorator
 * @mixes ui/Cancelable.Cancelable
 * @hoc
 * @public
 */
function configureExpandable (config) {
	const {getChildFocusTarget, noPointerMode} = {...defaultConfig, ...config};

	const useToggle = configureToggle({toggle: null, activate: 'onOpen', deactivate: 'onClose', prop: 'open'});
	const useRadio = configureRadio({activate: 'onOpen', deactivate: 'onClose', prop: 'open'});
	const useCancel = configureCancel({component: 'span', onCancel: handleCancel});
	const useSpotlightActivator = configureSpotlightActivator({noPointerMode, getChildFocusTarget});

	// eslint-disable-next-line no-shadow
	return function useExpandable (props) {
		let updated = {...props, ...useToggle(props)};
		updated = {...updated, ...useRadio(updated), ...useCancel(updated)};
		updated = {
			...updated,
			...useSpotlightActivator(updated),
			...useDeferChildren(!props.open && props.disabled)
		};

		return updated;
	};
}

const useExpandable = configureExpandable();
useExpandable.configure = configureExpandable;

export default useExpandable;
export {
	configureExpandable,
	defaultConfig,
	useExpandable
};
