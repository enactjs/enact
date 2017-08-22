/**
 * Components for creating regions of text that allow content that is wider than its container to
 * be revealed through a 'marquee' (horizontal scrolling) effect.
 *
 * @example
 * <div style={{width: '300px'}}>
 *   <MarqueeText marqueeOn="render">
 *     The quick brown fox jumped over the lazy dog.
 *   </MarqueeText>
 * </div>
 *
 * @module moonstone/Marquee
 * @exports Marquee
 * @exports ui/Marquee.MarqueeController
 * @exports ui/Marquee.MarqueeDecorator
 * @exports MarqueeText
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
