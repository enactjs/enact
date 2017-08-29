import MarqueeDecorator from './MarqueeDecorator';
import Remeasurable from '@enact/ui/Remeasurable';
/**
 * {@link moonstone/Marquee.MarqueeText} is a basic marqueeing text component.
 *
 * @class MarqueeText
 * @memberof moonstone/Marquee
 * @ui
 * @mixes moonstone/Marquee.MarqueeDecorator
 * @public
 */
const MarqueeText = Remeasurable(MarqueeDecorator('div'));
MarqueeText.displayName = 'MarqueeText';

export default MarqueeText;
export {MarqueeText, MarqueeText as MarqueeTextBase};
