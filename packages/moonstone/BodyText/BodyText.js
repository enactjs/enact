/**
 * Exports the {@link moonstone/BodyText.BodyText} and {@link moonstone/BodyText.BodyTextBase}
 * components.  The default export is {@link moonstone/BodyText.BodyTextBase}.
 *
 * @module moonstone/BodyText
 */

import factory from '@enact/core/factory';
// import {diffClasses} from '@enact/ui/MigrationAid';
import {BodyTextFactory as UiBodyTextFactory} from '@enact/ui/BodyText';

import Skinnable from '../Skinnable';

import componentCss from './BodyText.less';

/**
 * {@link moonstone/BodyText.BodyTextBaseFactory} is a factory for customizing BodyTextBase.
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
 * @memberof moonstone/BodyText
 * @factory
 * @public
 */
const BodyTextBase = BodyTextBaseFactory();

/**
 * {@link moonstone/BodyText.BodyText} is a stateless BodyText with Moonstone styling
 * applied.
 *
 * @class BodyText
 * @memberof moonstone/BodyText
 * @ui
 * @public
 */
const BodyText = Skinnable(
	BodyTextBase
);

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


export default BodyText;
export {
	BodyText,
	BodyTextBase,
	BodyTextFactory,
	BodyTextBaseFactory
};
