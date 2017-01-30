import kind from '@enact/core/kind';
import Holdable from '@enact/ui/Holdable';
import IconButton from '../IconButton';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';

const HoldableIconButton = Holdable(IconButton);

/**
 * {@link moonstone/IncrementSlider.IncrementSliderButton} is an
 * {@link moonstone/IconButton.IconButton} customized for
 * {@link moonstone/IncrementSlider.IncrementSlider}. It is optimized to only update when `disabled`
 * is changed to minimize unnecessary render cycles.
 *
 * @class IncrementSliderButton
 * @memberof moonstone/IncrementSlider
 * @ui
 * @private
 */

const IncrementSliderButtonBase = kind({
	name: 'IncrementSliderButton',

	computed: {
		onClick: ({disabled, onClick}) => disabled ? null : onClick
	},

	render: ({onClick, ...rest}) => {
		return (
			<HoldableIconButton
				{...rest}
				backgroundOpacity="transparent"
				onClick={onClick}
				onHold={onClick}
				onHoldPulse={onClick}
				small
			/>
		);
	}
});

const OnlyUpdate = onlyUpdateForKeys(['children', 'disabled']);
const IncrementSliderButton = OnlyUpdate(IncrementSliderButtonBase);

export default IncrementSliderButton;
export {
	IncrementSliderButton,
	IncrementSliderButtonBase
};
