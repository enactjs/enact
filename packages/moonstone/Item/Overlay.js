import factory from '@enact/core/factory';
// import {diffClasses} from '@enact/ui/MigrationAid';
import {OverlayFactory as UiOverlayFactory} from '@enact/ui/Item';

import componentCss from './Overlay.less';

/**
 * {@link moonstone/Item.Overlay} is the component inserted into each side of an
 * {@link moonstone/Item.ItemOverlay}.
 *
 * @class Overlay
 * @memberof moonstone/Item
 * @ui
 * @public
 */
const OverlayBaseFactory = factory({css: componentCss}, ({css}) => {
	// diffClasses('Moon Overlay', componentCss, css);

	return UiOverlayFactory({
		/* Replace classes in this step */
		css: /** @lends moonstone/Overlay.OverlayFactory.prototype */ {
			...componentCss,
			// Include the component class name so it too may be overridden.
			overlay: css.overlay
		}
	});
});

const OverlayBase = OverlayBaseFactory();

export default OverlayBase;
export {
	OverlayBase as Overlay,
	OverlayBase,
	OverlayBaseFactory as OverlayFactory,
	OverlayBaseFactory
};
