import deprecate from '@enact/core/internal/deprecate';
import AccessibilityDecorator from './AccessibilityDecorator';

/**
 * {@link moonstone/MoonstoneDecorator.TextSizeDecorator} is a Higher-order Component that
 * classifies an application with a target set of font sizing rules
 *
 * @class TextSizeDecorator
 * @memberof moonstone/MoonstoneDecorator
 * @hoc
 * @deprecated will be replaced by `AccessibilityDecorator` in 2.0.0
 * @public
 */
const TextSizeDecorator = deprecate(AccessibilityDecorator, {name: 'TextSizeDecorator', since: '1.7.0', message: 'Use `AccessibilityDecorator` instead', until: '2.0.0'});

export default TextSizeDecorator;
export {TextSizeDecorator};
