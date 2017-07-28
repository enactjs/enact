import MarqueeDecorator from './MarqueeDecorator';

/**
 * {@link moonstone/Marquee.MarqueeText} is a basic marqueeing text component.
 *
 * @class MarqueeText
 * @memberof moonstone/Marquee
 * @ui
 * @mixes moonstone/Marquee.MarqueeDecorator
 * @public
 */
const MarqueeText = MarqueeDecorator('div');
MarqueeText.displayName = 'MarqueeText';

export default MarqueeText;
export {MarqueeText, MarqueeText as MarqueeTextBase};
