import classNames from 'classnames';
import {Spotlight, Spottable, SpotlightContainerDecorator, SpotlightFocusableDecorator} from '@enact/spotlight';
import React, {PropTypes} from 'react';

import Icon from '../Icon';

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
		 * @type {String}
		 * @public
		 */
		iconEnd: PropTypes.string,

		/**
		 * The icon to be placed at the beginning of the input.
		 *
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

	inputKeyDown = (e) => {
		const keyCode = e.nativeEvent.keyCode;
		const {dismissOnEnter} = this.props;

		e.stopPropagation();

		switch (keyCode) {
			case 13:
				if (dismissOnEnter) {
					this.inputNode.blur();
				}
				break;
			case 37:
				if (this.inputNode.selectionStart === 0) {
					this.spotlightMove('left');
				}
				break;
			case 39:
				if (this.inputNode.selectionStart === this.inputNode.value.length) {
					this.spotlightMove('right');
				}
				break;
			case 38:
				this.spotlightMove('up');
				break;
			case 40:
				this.spotlightMove('down');
				break;
			default:
				break;
		}
	}

	getInputNode = (node) => {
		this.inputNode = node;
	}

	spotlightMove = (direction) => {
		if (!Spotlight.move(direction)) {
			this.inputNode.blur();
		}
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
		const firstIcon = icon('iconStart', this.props, classNames(iconClasses, css.iconStart)),
			lastIcon = icon('iconEnd', this.props, classNames(iconClasses, css.iconEnd));
		const containerProps = {};

		if (spotlightDisabled) {
			containerProps['data-container-id'] = rest['data-container-id'];
		}

		delete rest['data-container-id'];
		delete rest.dismissOnEnter;

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
