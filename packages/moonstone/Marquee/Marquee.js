/*
 * Exports the {@link moonstone/Marquee.Marquee} and {@link moonstone/Marquee.MarqueeBase}
 * components. The default export is {@link moonstone/Marquee.Marquee}.
 *
 * note: not jsdoc on purpose, exports in index.js
 */

import factory from '@enact/core/factory';
// import {diffClasses} from '@enact/ui/MigrationAid';
import {MarqueeFactory as UiMarqueeFactory} from '@enact/ui/Marquee';

import componentCss from './Marquee.less';

/**
 * {@link moonstone/Marquee.Marquee} is a stateless text container element which
 * implements a text cut-off followed by an ellipsis character.
 *
 * @class Marquee
 * @memberof moonstone/Marquee
 * @ui
 * @public
 */
const MarqueeBaseFactory = factory({css: componentCss}, ({css}) => {
	// diffClasses('Moon IconButton', componentCss, css);

	return UiMarqueeFactory({
		/* Replace classes in this step */
		css: /** @lends moonstone/Marquee.MarqueeFactory.prototype */ {
			...componentCss,
			// Include the component class name so it too may be overridden.
			marquee: css.marquee
		}
	});
});

const MarqueeBase = MarqueeBaseFactory();

export default MarqueeBase;
export {
	MarqueeBase as Marquee,
	MarqueeBase,
	MarqueeBaseFactory as MarqueeFactory,
	MarqueeBaseFactory
};
