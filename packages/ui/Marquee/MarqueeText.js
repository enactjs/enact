import MarqueeDecorator from './MarqueeDecorator';

/**
 * A basic marqueeing text component.
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
