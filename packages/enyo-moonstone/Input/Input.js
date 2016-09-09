import classNames from 'classnames';
import kind from 'enyo-core/kind';
import {Spotlight, Spottable, SpotlightContainerDecorator, SpotlightFocusableDecorator} from 'enyo-spotlight';
import React, {PropTypes} from 'react';

import Icon from '../Icon';

import css from './Input.less';

const PlainInput = kind({
	name: 'PlainInput',

	propTypes: {
		className: PropTypes.string,
		disabled: PropTypes.bool,
		onChange: PropTypes.func,
		placeholder: PropTypes.string,
		type: PropTypes.string,
		value: PropTypes.string
	},

	defaultProps: {
		disabled: false,
		placeholder: '',
		type: 'text',
		value: ''
	},

	styles: {
		css,
		className: 'input'
	},

	computed: {
		className: ({disabled, styler}) => styler.append({disabled})
	},

	render: ({inputRef, ...rest}) => {
		delete rest.useEnterKey;

		return (
			<input {...rest} ref={inputRef} />
		);
	}
});

const SpottablePlainInput = Spottable(kind({
	name: 'SpottablePlainInput',

	render: (props) => {
		delete props.spotlightDisabled;

		return (
			<PlainInput {...props} />
		);
	}
}));

const icon = (which, props, className) => {
	return props[which] ? <Icon className={className}>{props[which]}</Icon> : null;
};

class InputDecorator extends React.Component {
	static propTypes = {
		...PlainInput.propTypes,
		disabled: PropTypes.bool,
		iconEnd: PropTypes.string,
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

		delete rest.containerId;

		return (
			<label disabled={disabled} className={decoratorClasses} tabIndex={tabIndex} onKeyDown={onKeyDown} onFocus={onFocus} >
				{firstIcon}
				<SpottablePlainInput {...rest} decorated disabled={disabled} spotlightDisabled={!spotlightDisabled} onKeyDown={this.inputKeyDown} inputRef={this.getInputNode} />
				{lastIcon}
			</label>
		);
	}
}

const Input = SpotlightContainerDecorator(SpotlightFocusableDecorator({useEnterKey: true, pauseSpotlightOnFocus: true}, Spottable(InputDecorator)));

// Input, being the fully decorated control, is the default.
export default Input;
// Named default, Stateless decorated Input (base), Stateless undecorated Input.
export {Input, InputDecorator as InputBase, PlainInput, SpottablePlainInput};
