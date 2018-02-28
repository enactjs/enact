import MarqueeDecorator from './MarqueeDecorator';

/**
 * {@link moonstone/Marquee.MarqueeText} is a basic marqueeing text component.
 *
 * @class MarqueeText
 * @memberof moonstone/Marquee
 * @ui
 * @mixes moonstone/Marquee.MarqueeDecorator
 * @public
 * @deprecated since 1.15.0. Will be moved to {@link moonstone/Marquee.Marquee} in 2.0.0
 */
const MarqueeText = MarqueeDecorator('div');
MarqueeText.displayName = 'MarqueeText';

export default MarqueeText;
export {MarqueeText, MarqueeText as MarqueeTextBase};
