import kind from '@enact/core/kind';
import {SpotlightFocusableDecorator} from '@enact/spotlight';
import Changeable from '@enact/ui/Changeable';
import React from 'react';

import {Expandable, ExpandableItemBase} from '../ExpandableItem';
import {InputBase} from '../Input';

const Input = SpotlightFocusableDecorator(
	{useEnterKey: true, pauseSpotlightOnFocus: true},
	InputBase
);

const ExpandableInputBase = kind({
	name: 'ExpandableInput',
	propTypes: {
		disabled: React.PropTypes.bool,
		onChange: React.PropTypes.func,
		placeholder: React.PropTypes.string,
		type: React.PropTypes.string,
		value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number])
	},
	computed: {
		onInputChange: ({onChange}) => {
			return (ev) => {
				if (onChange) {
					onChange({value: ev.value});
				}
			};
		},
		onInputKeyDown: ({onKeyDown}) => {
			return (ev) => {
				// console.log('EI onInputKeyDown', ev);
				if (onKeyDown) {
					onKeyDown(ev);
				}
			};
		},
		onInputBlur: ({onBlur}) => {
			return (ev) => {
				console.log('EI onInputBlur', ev, ev.target, document.activeElement);
				if (onBlur) {
					onBlur(ev);
				}
			};
		},
	},
	render: (props) => {
		const {disabled, onInputBlur, onInputChange, onInputKeyDown, placeholder, type, value, ...rest} = props;
		return (
			<ExpandableItemBase {...rest} disabled={disabled}>
				<Input
					disabled={disabled}
					dismissOnEnter
					onChange={onInputChange}
					onBlur={onInputBlur}
					onKeyDown={onInputKeyDown}
					placeholder={placeholder}
					type={type}
					value={value}
				/>
			</ExpandableItemBase>
		);
	}
});

/* const ExpandableInput = Expandable({
	focusChildrenOnOpen: true,
	closeOnBlur: true
}, ExpandableInputBase);*/

const ExpandableInput = Expandable(
	Changeable(
		{mutable: true},
		ExpandableInputBase
	)
);

export default ExpandableInput;
export {ExpandableInput, ExpandableInputBase};
