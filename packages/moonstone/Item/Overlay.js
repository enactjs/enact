import factory from '@enact/core/factory';
// import {diffClasses} from '@enact/ui/MigrationAid';
import {OverlayFactory as UiOverlayFactory} from '@enact/ui/Item';

import componentCss from './Overlay.less';

/**
  * A factory for customizing the visual style of [OverlayBase]{@link moonstone/Item.OverlayBase}.
  *
  * @class OverlayBaseFactory
  * @memberof moonstone/Item
  * @factory
  * @public
  */
const OverlayBaseFactory = factory({css: componentCss}, ({css}) => {
	// diffClasses('Moon Overlay', componentCss, css);

	return UiOverlayFactory({
		/* Replace classes in this step */
		css: /** @lends moonstone/Item.OverlayFactory.prototype */ {
			...componentCss,
			// Include the component class name so it too may be overridden.
			overlay: css.overlay
		}
	});
});

/**
 * A stateless [Overlay]{@link moonstone/Item.Overlay}, with no HOCs applied.
 *
 * @class OverlayBase
 * @extends ui/Item.OverlayBase
 * @memberof moonstone/Item
 * @ui
 * @public
 */
const OverlayBase = OverlayBaseFactory();

/**
 * A factory for customizing the visual style of [Overlay]{@link moonstone/Item.Overlay}.
 * @see {@link moonstone/Item.OverlayBaseFactory}.
 *
 * @class OverlayFactory
 * @memberof moonstone/Item
 * @factory
 * @public
 */

/**
 * The component inserted into each side of an {@link moonstone/Item.ItemOverlay}.
 *
 * @class Overlay
 * @memberof moonstone/Item
 * @ui
 * @public
 */

export default OverlayBase;
export {
	OverlayBase as Overlay,
	OverlayBase,
	OverlayBaseFactory as OverlayFactory,
	OverlayBaseFactory
};
