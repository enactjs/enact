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
 * {@link moonstone/BodyText.BodyText} is a stateless BodyText with Moonstone styling
 * applied.
 *
 * @class BodyText
 * @memberof moonstone/BodyText
 * @ui
 * @public
 */
const BodyTextBaseFactory = factory({css: componentCss}, ({css}) => {
	// diffClasses('Moon IconButton', componentCss, css);

	return UiBodyTextFactory({
		/* Replace classes in this step */
		css: /** @lends moonstone/BodyText.BodyTextFactory.prototype */ {
			...componentCss,
			// Include the component class name so it too may be overridden.
			bodyText: css.bodyText
		}
	});
});

const BodyTextBase = BodyTextBaseFactory();

const BodyText = Skinnable(
	BodyTextBase
);

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
