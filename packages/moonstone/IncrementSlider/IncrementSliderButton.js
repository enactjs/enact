import kind from '@enact/core/kind';
import IconButton from '../IconButton';
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

	handlers: {
		onClick: (ev, {disabled, onClick}) => {
			if (!disabled) {
				onClick(ev);
			}
		}
	},

	render: (props) => (
		<IconButton {...props} backgroundOpacity="transparent" small />
	)
});

const OnlyUpdate = onlyUpdateForKeys(['children', 'disabled', 'spotlightDisabled']);
const IncrementSliderButton = OnlyUpdate(IncrementSliderButtonBase);

export default IncrementSliderButton;
export {
	IncrementSliderButton,
	IncrementSliderButtonBase
};
