/**
 * Exports the {@link module:@enact/moonstone/Input~Input} component.
 *
 * @module @enact/moonstone/Input
 */

import classNames from 'classnames';
import {SpotlightFocusableDecorator} from '@enact/spotlight';
import React, {PropTypes} from 'react';

import Icon from '../Icon';

import InputDecorator from './InputDecorator';
import {PlainInput} from './PlainInput';
import css from './Input.less';

const icon = (which, props, className) => {
	return props[which] ? <Icon className={className}>{props[which]}</Icon> : null;
};

class InputBase extends React.Component {
	static propTypes = {
		/**
		 * When `true`, applies a disabled style and the control becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * When `true`, blurs the input when the "enter" key is pressed.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		dismissOnEnter: PropTypes.bool,

		/**
		 * The icon to be placed at the end of the input.
		 *
		 * @see {@link module:@enact/moonstone/Icon~Icon}
		 * @type {String}
		 * @public
		 */
		iconEnd: PropTypes.string,

		/**
		 * The icon to be placed at the beginning of the input.
		 *
		 * @see {@link module:@enact/moonstone/Icon~Icon}
		 * @type {String}
		 * @public
		 */
		iconStart: PropTypes.string,

		/**
		 * The handler to run when the input value is changed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onChange: PropTypes.func,

		/**
		 * The placeholder text to display.
		 *
		 * @type {String}
		 * @default ''
		 * @public
		 */
		placeholder: PropTypes.string,

		/**
		 * The type of input. Accepted values correspond to the standard HTML5 input types.
		 *
		 * @type {String}
		 * @default 'text'
		 * @public
		 */
		type: PropTypes.string,

		/**
		 * The value of the input.
		 *
		 * @type {String|Number}
		 * @default ''
		 * @public
		 */
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
	}

	static defaultProps = {
		disabled: false,
		dismissOnEnter: false,
		placeholder: '',
		type: 'text',
		value: ''
	}

	blurInput = () => {
		this.decoratedNode.blur();
	}

	inputKeyDown = (e) => {
		const keyCode = e.nativeEvent.keyCode;
		const {dismissOnEnter} = this.props;

		switch (keyCode) {
			case 13:
				if (dismissOnEnter) {
					this.blurInput();
				}
				break;
			case 37:
				if (this.decoratedNode.selectionStart === 0) {
					this.blurInput();
				}
				break;
			case 39:
				if (this.decoratedNode.selectionStart === this.decoratedNode.value.length) {
					this.blurInput();
				}
				break;
			case 38:
			case 40:
				this.blurInput();
				break;
			default:
				break;
		}
	}

	getDecoratedNode = (node) => {
		this.decoratedNode = node;
	}

	getDecoratorNode = (node) => {
		this.decoratorNode = node;
	}

	handleDecoratorClick = (e) => {
		const {onClick} = this.props;
		if (e.target !== this.decoratedNode) {
			this.decoratedNode.focus();
			if (onClick) onClick(e);
		}
	}

	render () {
		const {disabled, className, iconStart, iconEnd, onFocus, onKeyDown, spotlightDisabled, ...rest} = this.props;
		const iconClasses = classNames(
			css.decoratorIcon,
			iconStart ? css[iconStart] : null,
			iconEnd ? css[iconEnd] : null
		);
		const firstIcon = icon('iconStart', this.props, classNames(iconClasses, css.iconStart)),
			lastIcon = icon('iconEnd', this.props, classNames(iconClasses, css.iconEnd));

		delete rest.dismissOnEnter;

		return (
			<InputDecorator disabled={disabled} className={className} onClick={this.handleDecoratorClick} onFocus={onFocus} onKeyDown={onKeyDown} spotlightDisabled={spotlightDisabled} decoratorRef={this.getDecoratorNode} >
				{firstIcon}
				<PlainInput {...rest} disabled={disabled} onKeyDown={this.inputKeyDown} inputRef={this.getDecoratedNode} spotlightDisabled={!spotlightDisabled} />
				{lastIcon}
			</InputDecorator>
		);
	}
}

const Input = SpotlightFocusableDecorator(
	{useEnterKey: true, pauseSpotlightOnFocus: true},
	InputBase
);

export default Input;
export {Input, InputBase};
