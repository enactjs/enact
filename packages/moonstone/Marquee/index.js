/**
 * Exports the {@link moonstone/Marquee.Marquee},
 * {@link moonstone/Marquee.MarqueeBase},
 * {@link moonstone/Marquee.MarqueeController},
 * {@link moonstone/Marquee.MarqueeDecorator}, and
 * {@link moonstone/Marquee.MarqueeText} components.
 *
 * The default export is {@link moonstone/Marquee.Marquee}.
 *
 * @module moonstone/Marquee
 */

import {MarqueeController, MarqueeDecorator, MarqueeText, controlContextTypes} from '@enact/ui/Marquee';
import Marquee from './Marquee';

export default Marquee;
export {
	controlContextTypes,
	Marquee,
	Marquee as MarqueeBase,
	MarqueeController,
	MarqueeDecorator,
	MarqueeText
};
