import MarqueeDecorator from './MarqueeDecorator';

/**
 * {@link ui/Marquee.MarqueeText} is a basic marqueeing text component.
 *
 * @class MarqueeText
 * @memberof ui/Marquee
 * @ui
 * @mixes ui/Marquee.MarqueeDecorator
 * @public
 */
const MarqueeText = MarqueeDecorator('div');
MarqueeText.displayName = 'MarqueeText';

export default MarqueeText;
export {MarqueeText, MarqueeText as MarqueeTextBase};
