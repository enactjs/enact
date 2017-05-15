import kind from '@enact/core/kind';
import Picker from '@enact/moonstone/Picker';
import {contextTypes} from '@enact/i18n/I18nDecorator';
import React from 'react';
import PropTypes from 'prop-types';

const PickerRTL = kind({

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
		clientStyle: ({rtl}, {rtl: contextRtl}) => {
			const options = {};

			if (contextRtl) {
				options.incrementIcon = 'arrowlargeleft';
				options.decrementIcon = 'arrowlargeright';
			} else {
				options.incrementIcon = 'arrowlargeright';
				options.decrementIcon = 'arrowlargeleft';
			}

			return options;
		}
	},

	render ({children, clientStyle, ...rest}) {
		delete rest.rtl;
		return (
			<div>
				<Picker
					{...rest}
					incrementIcon={clientStyle.incrementIcon}
					decrementIcon={clientStyle.decrementIcon}
					style={{flexDirection:'unset'}}
				>
					{children}
				</Picker>
			</div>
		);
	}
});

PickerRTL.contextTypes = contextTypes;
export default PickerRTL;
