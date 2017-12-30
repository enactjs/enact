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

import Marquee from './Marquee';
import {MarqueeController, contextTypes} from './MarqueeController';
import MarqueeDecorator from './MarqueeDecorator';
import MarqueeText from './MarqueeText';

export default MarqueeDecorator;
export {
	contextTypes as controlContextTypes,
	Marquee,
	MarqueeController,
	MarqueeDecorator,
	MarqueeText
};
