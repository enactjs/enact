import kind from '@enact/core/kind';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import Picker from '@enact/moonstone/Picker';
import React from 'react';
import PropTypes from 'prop-types';

const PickerRTLBase = kind({

	name: 'PickerRTL',

	propTypes: {
		children: PropTypes.node.isRequired,
		disabled: PropTypes.bool,
		joined: PropTypes.bool,
		noAnimation: PropTypes.bool,
		rtl: PropTypes.bool,
		width: PropTypes.string,
		wrap: PropTypes.bool
	},

	defaultProps: {
		disabled: false,
		joined: false,
		noAnimation: false,
		rtl: false,
		width: 'medium',
		wrap: false
	},

	computed: {
		clientStyle: ({rtl}) => {
			const options = {
				incrementIcon: 'arrowlargeright',
				decrementIcon: 'arrowlargeleft'
			};
			if (rtl) {
				options.incrementIcon = 'arrowlargeleft';
				options.decrementIcon = 'arrowlargeright';
			}

			return options;
		}
	},

	render ({children, clientStyle, ...rest}) {
		delete rest.rtl;
		return (
			<Picker
				{...rest}
				incrementIcon={clientStyle.incrementIcon}
				decrementIcon={clientStyle.decrementIcon}
				style={{flexDirection:'unset'}}
			>
				{children}
			</Picker>
		);
	}
});

const PickerRTL = I18nContextDecorator(
	{rtlProp: 'rtl'},
	PickerRTLBase
);

export default PickerRTL;
