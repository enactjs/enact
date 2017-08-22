import factory from '@enact/core/factory';
import kind from '@enact/core/kind';
import React from 'react';
// import {diffClasses} from '@enact/ui/MigrationAid';
import {InputDecoratorIconFactory as UiInputDecoratorIconFactory} from '@enact/ui/Input';

import {IconFactory} from '../Icon';
import Skinnable from '../Skinnable';

import componentCss from './Input.less';

/**
 * The stateless functional base component for {@link moonstone/Input.InputDecoratorIcon}.
 *
 * @class InputDecoratorIconBaseFactory
 * @memberof moonstone/Input
 * @factory
 * @private
 */
const InputDecoratorIconBaseFactory = factory({css: componentCss}, ({css}) => {
	// diffClasses('Moon IconButton', componentCss, css);

	const UiInputDecoratorIcon = UiInputDecoratorIconFactory({
		/* Replace classes in this step */
		css: /** @lends moonstone/InputDecoratorIcon.InputDecoratorIconBaseFactory.prototype */ {
			...componentCss,
			// Include the component class name so it too may be overridden.
			InputDecoratorIcon: css.InputDecoratorIcon
		}
	});
	const Icon = IconFactory({css});

	return kind({
		name: 'MoonstoneInputDecorator',

		styles: {
			css: componentCss,
			className: 'decoratorIcon'
		},

		render: (props) => {
			return (
				<UiInputDecoratorIcon {...props} Icon={Icon} />
			);
		}
	});
});

/**
 * An icon displayed either before or after the input field of an {@link moonstone/Input.Input},
 * without HOCs applied.
 *
 * @class InputDecoratorIconBase
 * @memberof moonstone/Input
 * @ui
 * @private
 */
const InputDecoratorIconBase = InputDecoratorIconBaseFactory();

/**
 * An icon displayed either before or after the input field of an {@link moonstone/Input.Input}.
 *
 * @class InputDecoratorIcon
 * @memberof moonstone/Input
 * @ui
 * @private
 */
const InputDecoratorIcon = Skinnable(
	InputDecoratorIconBase
);

/**
 * A factory for customizing {@link moonstone/Input.InputDecoratorIcon}.
 *
 * @class InputDecoratorIconFactory
 * @memberof moonstone/Input
 * @factory
 * @private
 */
const InputDecoratorIconFactory = (props) => Skinnable(
	InputDecoratorIconBaseFactory(props)
);


export default InputDecoratorIcon;
export {
	InputDecoratorIcon,
	InputDecoratorIconBase,
	InputDecoratorIconFactory,
	InputDecoratorIconBaseFactory
};
