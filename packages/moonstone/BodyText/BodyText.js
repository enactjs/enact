/**
 * Exports the {@link moonstone/BodyText.BodyText} and {@link moonstone/BodyText.BodyTextBase}
 * components.  The default export is {@link moonstone/BodyText.BodyTextBase}.
 *
 * @module moonstone/BodyText
 */

import factory from '@enact/core/factory';
// import {diffClasses} from '@enact/ui/MigrationAid';
import {BodyTextBaseFactory as UiBodyTextFactory} from '@enact/ui/BodyText';

import Skinnable from '../Skinnable';

import componentCss from './BodyText.less';

/**
 * [BodyTextBaseFactory]{@link moonstone/BodyText.BodyTextBaseFactory} is a factory for customizing
 * the visual style of the base version of [BodyText]{@link moonstone/BodyText} (without HOCs applied).
 *
 * @class BodyTextBaseFactory
 * @memberof moonstone/BodyText
 * @factory
 * @public
 */
const BodyTextBaseFactory = factory({css: componentCss}, ({css}) => {
	// diffClasses('Moon BodyText', componentCss, css);

	return UiBodyTextFactory({
		/* Replace classes in this step */
		css: /** @lends moonstone/BodyText.BodyTextBaseFactory.prototype */ {
			...componentCss,
			// Include the component class name so it too may be overridden.
			bodyText: css.bodyText
		}
	});
});

/**
 * {@link moonstone/BodyText.BodyTextBase} is a stateless BodyText with Moonstone styling
 * applied, without HOCs applied.
 *
 * @class BodyTextBase
 * @extends ui/BodyTextBase
 * @memberof moonstone/BodyText
 * @ui
 * @public
 */
const BodyTextBase = BodyTextBaseFactory();

/**
 * {@link moonstone/BodyText.BodyTextFactory} is a factory for customizing BodyText.
 *
 * @class BodyTextFactory
 * @memberof moonstone/BodyText
 * @factory
 * @public
 */
const BodyTextFactory = (props) => Skinnable(
	BodyTextBaseFactory(props)
);

/**
 * {@link moonstone/BodyText.BodyText} is a stateless BodyText with Moonstone styling
 * applied.
 *
 * @class BodyText
 * @memberof moonstone/BodyText
 * @extends moonstone/BodyTextBase
 * @mixes moonstone/Skinnable
 * @ui
 * @public
 */
const BodyText = BodyTextFactory();

export default BodyText;
export {
	BodyText,
	BodyTextBase,
	BodyTextFactory,
	BodyTextBaseFactory
};
