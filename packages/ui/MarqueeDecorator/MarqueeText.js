import MarqueeDecorator from './MarqueeDecorator';

/**
 * {@link ui/MarqueeDecorator.MarqueeText} is a basic marqueeing text component.
 *
 * @class MarqueeText
 * @memberof ui/MarqueeDecorator
 * @ui
 * @mixes ui/MarqueeDecorator.MarqueeDecorator
 * @public
 */
const MarqueeText = MarqueeDecorator('div');
MarqueeText.displayName = 'MarqueeText';

export default MarqueeText;
export {MarqueeText, MarqueeText as MarqueeTextBase};
