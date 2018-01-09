/**
 * Provides a marquee bevavior Higher-Order Component (HOC) and a basic pre-wrapped marqueeing text
 * component, {@link ui/MarqueeDecorator.MarqueeText}.
 *
 * @module ui/MarqueeDecorator
 * @exports controlContextTypes
 * @exports MaruqeeController
 * @exports MarqueeDecorator
 * @exports MarqueeText
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
