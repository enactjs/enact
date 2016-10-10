import MarqueeDecorator from './MarqueeDecorator';

/**
 * {@link module:@enact/moonstone/Marquee~MarqueeText} is a basic marqueeing text component.
 *
 * @class MarqueeText
 * @ui
 * @public
 */
const MarqueeText = MarqueeDecorator('div');
MarqueeText.displayName = 'MarqueeText';

export default MarqueeText;
export {MarqueeText, MarqueeText as MarqueeTextBase};
