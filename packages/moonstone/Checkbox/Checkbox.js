/**
 * This represents a Boolean state and looks like a check mark in a circle. It can be used
 * standalone but will typically be used as a child of {@link moonstone/CheckboxItem}.
 *
 * @module moonstone/Checkbox
 * @exports Checkbox
 * @exports CheckboxBase
 * @exports CheckboxBaseFactory
 * @exports CheckboxFactory
 */

import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import React from 'react';
import {CheckboxFactory as UiCheckboxFactory} from '@enact/ui/Checkbox';

import {IconFactory} from '../Icon';
import Skinnable from '../Skinnable';

import componentCss from './Checkbox.less';

/**
* A factory for customizing the visual style of [CheckboxBase]{@link moonstone/Checkbox.CheckboxBase}.
*
* @class CheckboxBaseFactory
* @memberof moonstone/Checkbox
* @factory
* @public
*/
const CheckboxBaseFactory = factory({css: componentCss}, ({css}) => {
	// diffClasses('Moon Checkbox', componentCss, css);

	const UiCheckbox = UiCheckboxFactory({
		/* Replace classes in this step */
		css: /** @lends moonstone/Checkbox.CheckboxBaseFactory.prototype */ {
			...componentCss,
			// Include the component class name so it too may be overridden.
			checkbox: css.checkbox
		}
	});
	const Icon = IconFactory({css});

	return kind({
		name: 'Checkbox',

		styles: {
			css: componentCss,
			className: 'checkbox'
		},

		render: (props) => {
			return (
				<UiCheckbox {...props} Icon={Icon} />
			);
		}
	});
});

/**
 * A stateless [Checkbox]{@link moonstone/Checkbox.Checkbox}, with no HOCs applied.
 *
 * @class CheckboxBase
 * @extends ui/CheckboxBase
 * @memberof moonstone/Checkbox
 * @ui
 * @public
 */
const CheckboxBase = CheckboxBaseFactory();

/**
* A factory for customizing the visual style of [Checkbox]{@link moonstone/Checkbox.Checkbox}.
*
* @class CheckboxFactory
* @memberof moonstone/Checkbox
* @factory
* @public
*/
const CheckboxFactory = (props) => Skinnable(
	CheckboxBaseFactory(props)
);

/**
 * A ready-to-use {@link ui/Checkbox}, with HOCs applied.
 *
 * @class Checkbox
 * @memberof moonstone/Checkbox
 * @extends moonstone/Checkbox
 * @mixes moonstone/Skinnable
 * @ui
 * @public
 */
const Checkbox = CheckboxFactory();

export default Checkbox;
export {
	Checkbox,
	CheckboxBase,
	CheckboxFactory,
	CheckboxBaseFactory
};
