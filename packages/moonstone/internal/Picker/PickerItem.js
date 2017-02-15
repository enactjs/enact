import kind from '@enact/core/kind';
import React from 'react';

import {MarqueeText} from '../../Marquee';

import css from './Picker.less';

const PickerItemBase = kind({
	name: 'PickerItem',

	propTypes: {
		/**
		 * When `true`, the [button]{@glossary button} is shown as disabled and does not
		 * generate tap [events]{@glossary event}.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: React.PropTypes.bool,
		/**
		 * Determines the user interaction of the control. A joined picker allows the user to use
		 * the arrow keys to adjust the picker's value. The user may no longer use those arrow keys
		 * to navigate, while this control is focused. A split control allows full navigation,
		 * but requires individual ENTER presses on the incrementer and decrementer buttons.
		 * Pointer interaction is the same for both formats.
		 *
		 * @type {Boolean}
		 * @public
		 */
		joined: React.PropTypes.bool
	},

	styles: {
		css,
		className: 'item'
	},

	render: ({disabled, joined, ...rest}) => {
		const marqueeControl =  !disabled && joined ? 'focus' : 'hover';
		return (
			<MarqueeText {...rest} marqueeCentered marqueeOn={marqueeControl} />
		);
	}
});

export default PickerItemBase;
export {PickerItemBase as PickerItem, PickerItemBase};
