import kind from '@enact/core/kind';
import IconButton from '@enact/moonstone/IconButton';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';

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
		onClick: ({disabled, onClick}) => disabled || onClick
	},

	render: (props) => (
		<IconButton {...props} small />
	)
});

const OnlyUpdateForDisabled = onlyUpdateForKeys(['disabled']);
const IncrementSliderButton = OnlyUpdateForDisabled(IncrementSliderButtonBase);

export default IncrementSliderButton;
export {
	IncrementSliderButton,
	IncrementSliderButtonBase
};
