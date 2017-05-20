import Cancelable from '@enact/ui/Cancelable';
import hoc from '@enact/core/hoc';
import RadioDecorator from '@enact/ui/RadioDecorator';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import Toggleable from '@enact/ui/Toggleable';

import ExpandableSpotlightDecorator from './ExpandableSpotlightDecorator';

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
const handleCancel = function (props) {
	if (props.open) {
		props.onClose();
		return true;
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
 * {@link moonstone/ExpandableItem.Expandable} manages the open state of a component
 * and adds {@link ui/Cancelable.Cancelable} support to call the `onClose` handler on
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
const Expandable = hoc(defaultConfig, (config, Wrapped) => {
	return Toggleable(
		{toggle: null, activate: 'onOpen', deactivate: 'onClose', prop: 'open'},
		RadioDecorator(
			{activate: 'onOpen', deactivate: 'onClose', prop: 'open'},
			Cancelable(
				{component: 'span', onCancel: handleCancel},
				SpotlightContainerDecorator(
					ExpandableSpotlightDecorator(
						{noPointerMode: config.noPointerMode},
						Wrapped
					)
				)
			)
		)
	);
});

export default Expandable;
export {Expandable};
