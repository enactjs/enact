/**
 * Displays multi-line text in a block with a medium font weight.
 *
 * @example
 * <BodyText>
 *   Lots of room here. Put whatever you like.
 * </BodyText>
 *
 * @module moonstone/BodyText
 * @exports BodyText
 * @exports BodyTextBase
 * @exports BodyTextBaseFactory
 * @exports BodyTextFactory
 */

import factory from '@enact/core/factory';
// import {diffClasses} from '@enact/ui/MigrationAid';
import {BodyTextBaseFactory as UiBodyTextFactory} from '@enact/ui/BodyText';

import Skinnable from '../Skinnable';

import componentCss from './BodyText.less';

/**
 * A factory for customizing the visual style of [BodyTextBase]{@link moonstone/BodyText.BodyTextBase}.
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
 * A stateless [BodyText]{@link moonstone/BodyText.BodyText}, with no HOCs applied.
 *
 * @class BodyTextBase
 * @extends ui/BodyText.BodyTextBase
 * @memberof moonstone/BodyText
 * @ui
 * @public
 */
const BodyTextBase = BodyTextBaseFactory();

/**
 * A factory for customizing the visual style of [BodyText]{@link moonstone/BodyText.BodyText}.
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
 * A ready-to-use {@link ui/BodyText}, with HOCs applied.
 *
 * @class BodyText
 * @memberof moonstone/BodyText
 * @extends moonstone/BodyText.BodyTextBase
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
