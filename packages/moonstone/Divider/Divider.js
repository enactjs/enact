/**
 * A simply styled component that may be used as a separator between groups of components.
 *
 * @example
 * <Divider>Divider Text</Divider>
 *
 * @module moonstone/Divider
 * @exports Divider
 * @exports DividerBase
 * @exports DividerBaseFactory
 * @exports DividerFactory
 */

import factory from '@enact/core/factory';
// import {diffClasses} from '@enact/ui/MigrationAid';
import {DividerFactory as UiDividerFactory} from '@enact/ui/Divider';

import Skinnable from '../Skinnable';

import componentCss from './Divider.less';

/**
 * A Factory wrapper around {@link moonstone/Divider.DividerBase} that allows overriding
 * certain classes of the base `Divider` components at design time.
 *
 * @class DividerBaseFactory
 * @memberof moonstone/Divider
 * @factory
 * @public
 */
const DividerBaseFactory = factory({css: componentCss}, ({css}) => {
	// diffClasses('Moon Divider', componentCss, css);

	return UiDividerFactory({
		/* Replace classes in this step */
		css: /** @lends moonstone/Divider.DividerBaseFactory.prototype */ {
			...componentCss,
			// Include the component class name so it too may be overridden.
			divider: css.divider
		}
	});
});

/**
 * A simply styled component that may be used as a separator between groups of components.
 *
 * @class DividerBase
 * @memberof moonstone/Divider
 * @extends ui/Divider.Divider
 * @ui
 * @public
 */
const DividerBase = DividerBaseFactory();

/**
 * A Factory wrapper around {@link moonstone/Divider.Divider} that allows overriding
 * certain classes of the `Divider` components at design time.
 *
 * @class DividerFactory
 * @memberof moonstone/Divider
 * @factory
 * @public
 */
const DividerFactory = (props) => Skinnable(
	DividerBaseFactory(props)
);

/**
 * A simply styled component that may be used as a separator between groups of components.
 *
 * @class Divider
 * @memberof moonstone/Divider
 * @extends moonstone/Divider.DividerBase
 * @mixes moonstone/Skinnable
 * @ui
 * @public
 */
const Divider = DividerFactory();

export default Divider;
export {
	Divider,
	DividerBase,
	DividerFactory,
	DividerBaseFactory
};
