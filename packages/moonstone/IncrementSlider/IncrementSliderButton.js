import Holdable from '../internal/Holdable';
import kind from '@enact/core/kind';
import IconButton from '../IconButton';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import React from 'react';
import PropTypes from 'prop-types';
import {withSkinnableProps} from '../Skinnable';

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

	propTypes: /** @lends moonstone/IncrementSlider.IncrementSliderButton.prototype */ {
		onClick: PropTypes.func
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

const OnlyUpdate = onlyUpdateForKeys(['children', 'disabled', 'skin', 'spotlightDisabled', 'aria-label']);
const IncrementSliderButton = withSkinnableProps(OnlyUpdate(IncrementSliderButtonBase));

export default IncrementSliderButton;
export {
	IncrementSliderButton,
	IncrementSliderButtonBase
};
