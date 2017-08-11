/**
 * Components for creating regions of text that allow content that is wider than its container to
 * be revealed through a 'marquee' (horizontal scrolling) effect.
 *
 * @module ui/Marquee
 * @exports Marquee
 * @exports MarqueeController
 * @exports MarqueeDecorator
 * @exports MarqueeFactory
 * @exports MarqueeText
 */

import Marquee, {MarqueeFactory} from './Marquee';
import {MarqueeController, contextTypes} from './MarqueeController';
import MarqueeDecorator from './MarqueeDecorator';
import MarqueeText from './MarqueeText';

export default Marquee;
export {
	contextTypes as controlContextTypes,
	Marquee,
	Marquee as MarqueeBase,
	MarqueeController,
	MarqueeDecorator,
	MarqueeText,
	MarqueeFactory
};
