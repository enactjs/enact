import hoc from '@enact/core/hoc';
import React from 'react';
import PropTypes from 'prop-types';
import {VoiceControl} from '@enact/webos/VoiceControl/VoiceControl';
import {forward} from '@enact/core/handle';

const defaultConfig = {
	voiceSlot: []
};

const VoiceControlDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {voiceSlot} = config;

	return class extends React.Component {
		static displayName = 'VoiceControlDecorator'

		static propTypes = {
			voiceLabel: PropTypes.string
		}

		constructor (props) {
			super(props);
			this.voiceList = [];
		}

		componentDidMount () {
			const {voiceLabel} = this.props;

			if (voiceSlot.length > 0) {
				let list = [];
				for (let t in voiceSlot) {
					const {voiceIntent, voiceHandler, voiceParams} = voiceSlot[t];
					list.push({
						voiceIntent: voiceIntent,
						voiceLabel: voiceLabel,
						onVoice: (e) => {
							const params = voiceParams || e;
							forward(voiceHandler, params, this.props);
						}
					});
				}
				this.voiceList = VoiceControl.addList(list);
			}
		}

		componentWillUnmount () {
			if (this.voiceList.length > 0) {
				VoiceControl.removeList(this.voiceList);
			}
		}

		render () {
			const props = {...this.props};
			delete props.voiceLabel;

			return (
				<Wrapped {...props} />
			);
		}
	};
});

export default VoiceControlDecorator;
export {VoiceControlDecorator};
