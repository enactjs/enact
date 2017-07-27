/**
 * Exports the {@link moonstone/Divider.Divider} component.
 *
 * @module moonstone/Divider
 */

import factory from '@enact/core/factory';

import {DividerFactory as UiDividerFactory} from '@enact/ui/Divider';

import Skinnable from '../Skinnable';

import componentCss from './Divider.less';

/**
 * {@link moonstone/Divider.Divider} is a simply styled component that may be used as a separator
 * between groups of components.
 *
 * @class Divider
 * @memberof moonstone/Divider
 * @ui
 * @public
 */
const DividerBaseFactory = factory({css: componentCss}, ({css}) => {
	// console.group('Moon Divider');
	// for (const key in componentCss) {
	// 	if (componentCss[key] !== css[key]) console.log(key, ':', componentCss[key], '   VS   ', css[key]);
	// }
	// console.groupEnd();
	return UiDividerFactory({
		/* Replace classes in this step */
		css: /** @lends moonstone/Button.DividerFactory.prototype */ {
			...componentCss,
			// Include the component class name so it too may be overridden.
			divider: css.divider
		}
	});
});

const DividerBase = DividerBaseFactory();

const Divider = Skinnable(
	DividerBase
);

const DividerFactory = (props) => Skinnable(
	DividerBaseFactory(props)
);


export default Divider;
export {
	Divider,
	// DividerBase,
	DividerFactory,
	DividerBaseFactory
};
