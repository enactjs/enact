/**
 * Exports the {@link module:@enact/moonstone/Input~Input} component.
 *
 * @module @enact/moonstone/Input
 */

import classNames from 'classnames';
import {Spotlight, Spottable, SpotlightContainerDecorator, SpotlightFocusableDecorator} from '@enact/spotlight';
import React, {PropTypes} from 'react';

import Icon from '../Icon';

import {PlainInput, PlainInputBase} from './PlainInput';
import css from './Input.less';

const icon = (which, props, className) => {
	return props[which] ? <Icon className={className}>{props[which]}</Icon> : null;
};

/**
 * {@link module:@enact/moonstone/Input~Input} is a {@link module:@enact/ui/Spottable~Spottable} <input>.
 *
 * @class Input
 * @ui
 * @public
 */
class InputBase extends React.Component {
	static propTypes = {
		/**
		 * See {@link module:@enact/moonstone/PlainInput~PlainInputBase}
		 */
		...PlainInputBase.propTypes,
		/**
		 * Applies a disabled visual state to the input.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,
		/**
		 * A string for an {@link module:@enact/moonstone/Icon~Icon} to use at the
		 * end of the input.
		 *
		 * @module @enact/moonstone/Input
		 */
		iconEnd: PropTypes.string,
		/**
		 * A string for an {@link module:@enact/moonstone/Icon~Icon} to use at the
		 * beginning of the input.
		 *
		 * @module @enact/moonstone/Input
		 */
		iconStart: PropTypes.string
	}

	constructor (props) {
		super(props);
	}

	inputKeyDown = (e) => {
		const keyCode = e.nativeEvent.keyCode;

		e.stopPropagation();

		switch (keyCode) {
			case 37:
				if (this.inputNode.selectionStart === 0) {
					Spotlight.move('left');
				}
				break;
			case 39:
				if (this.inputNode.selectionStart === this.inputNode.value.length) {
					Spotlight.move('right');
				}
				break;
			case 38:
				Spotlight.move('up');
				break;
			case 40:
				Spotlight.move('down');
				break;
			default:
				break;
		}
	}

	getInputNode = (node) => {
		this.inputNode = node;
	}

	render () {
		const {disabled, className, iconStart, iconEnd, tabIndex, onKeyDown, onFocus, spotlightDisabled, ...rest} = this.props;
		const decoratorClasses = classNames(
			css.decorator,
			disabled,
			className
		);
		const iconClasses = classNames(
			css.decoratorIcon,
			iconStart ? css[iconStart] : null,
			iconEnd ? css[iconEnd] : null
		);
		const firstIcon = icon('iconStart', this.props, iconClasses),
			lastIcon = icon('iconEnd', this.props, iconClasses);
		const containerProps = {};
		
		if (spotlightDisabled) {
			containerProps['data-container-id'] = rest['data-container-id'];
		}

		delete rest['data-container-id'];

		return (
			<label {...containerProps} disabled={disabled} className={decoratorClasses} tabIndex={tabIndex} onKeyDown={onKeyDown} onFocus={onFocus} >
				{firstIcon}
				<PlainInput {...rest} decorated disabled={disabled} spotlightDisabled={!spotlightDisabled} onKeyDown={this.inputKeyDown} inputRef={this.getInputNode} />
				{lastIcon}
			</label>
		);
	}
}

const Input = SpotlightContainerDecorator(
	SpotlightFocusableDecorator(
		{useEnterKey: true, pauseSpotlightOnFocus: true},
		Spottable(InputBase)
	)
);

export default Input;
export {Input, InputBase};
