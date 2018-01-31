import hoc from '@enact/core/hoc';
import React from 'react';
import PropTypes from 'prop-types';
import {VoiceControl} from '@enact/webos/VoiceControl/VoiceControl';

const defaultConfig = {};

const VoiceControlDecorator = hoc(defaultConfig, (config, Wrapped) => {
	return class extends React.Component {
		static displayName = 'VoiceControlDecorator'

		static propTypes = {
			voiceSlot: PropTypes.array
		}

		constructor (props) {
			super(props);
		}

		componentDidMount () {
			const voiceSlot = this.props.voiceSlot || config.voiceSlot;

			if (voiceSlot && voiceSlot.length && voiceSlot.length > 0) {
				this.voiceList = VoiceControl.addList(voiceSlot);
			}
		}

		componentWillUnmount () {
			if (this.voiceList.length > 0) {
				VoiceControl.removeList(this.voiceList);
			}
		}

		render () {
			const props = {...this.props};
			delete props.voiceSlot;

			return (
				<Wrapped {...props} />
			);
		}
	};
});

export default VoiceControlDecorator;
export {VoiceControlDecorator};
