/**
 * Exports the {@link moonstone/Input/InputDecorator.InputDecorator} component.
 *
 * @module moonstone/Input/InputDecorator
 * @private
 */

import kind from '@enact/core/kind';
import {Spottable} from '@enact/spotlight';
import React, {PropTypes} from 'react';

import css from './Input.less';

/**
 * {@link moonstone/Input/InputDecorator.InputDecorator} is a control that provides input styling. Any controls
 * in the InputDecorator will appear to be inside an area styled as an input. Usually,
 * an InputDecorator surrounds a {@link moonstone/Input.Input}:
 *
 * @class InputDecoratorBase
 * @memberof moonstone/Input/InputDecorator
 * @ui
 * @private
 */
const InputDecoratorBase = kind({
	name: 'InputDecoratorBase',

	propTypes: /** @lends moonstone/Input/InputDecorator.InputDecoratorBase.prototype */ {
		/**
		 * The method to run when the decorator mounts, giving a reference to the DOM.
		 *
		 * @type {Function}
		 * @private
		 */
		decoratorRef: PropTypes.func,

		/**
		 * Applies a disabled visual state to the input decorator.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool
	},

	defaultProps: {
		disabled: false
	},

	styles: {
		css,
		className: 'decorator'
	},

	computed: {
		className: ({disabled, styler}) => styler.append({disabled})
	},

	render: ({decoratorRef, ...rest}) => (
		<div {...rest} ref={decoratorRef} />
	)
});

/**
 * {@link moonstone/Input/InputDecorator.InputDecorator} is a control that provides input styling.
 * Any controls in the InputDecorator will appear to be inside an area styled as an input. Usually,
 * an InputDecorator surrounds a {@link moonstone/Input.Input}:
 *
 * @class InputDecorator
 * @memberof moonstone/Input/InputDecorator
 * @ui
 * @mixes spotlight.Spottable
 * @private
 */
const InputDecorator = Spottable({emulateMouse: false}, kind({
	name: 'InputDecorator',

	render: (props) => {
		return (
			<InputDecoratorBase {...props} />
		);
	}
}));

export default InputDecorator;
export {InputDecorator, InputDecoratorBase};
