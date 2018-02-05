import hoc from '@enact/core/hoc';
import React from 'react';
import PropTypes from 'prop-types';
import {VoiceControl} from '@enact/webos/VoiceControl/VoiceControl';
import {forward} from '@enact/core/handle';

const defaultConfig = {};

const VoiceControlDecorator = hoc(defaultConfig, (config, Wrapped) => {
	const {voiceIntent, voiceHandler, voiceParams} = config;

	return class extends React.Component {
		static displayName = 'VoiceControlDecorator'

		static propTypes = {
			voiceLabel: PropTypes.string
		}

		constructor (props) {
			super(props);
			this.voiceID = VoiceControl.generateID();
		}

		onVoice = (e) => {
			const params = voiceParams || e;
			forward(voiceHandler, params, this.props);
			// this.props[voiceHandler](ev);
		}

		componentDidMount () {
			const {voiceLabel} = this.props;

			VoiceControl.add({
				voiceID: this.voiceID,
				voiceIntent: voiceIntent,
				voiceLabel: voiceLabel,
				onVoice: this.onVoice
			});
		}

		componentWillUnmount () {
			VoiceControl.remove(this.voiceID);
		}

		render () {
			const props = {...this.props};
			props[voiceHandler] = this.onVoice;

			delete props.voiceLabel;

			return (
				<Wrapped {...props} />
			);
		}
	};
});

export default VoiceControlDecorator;
export {VoiceControlDecorator};
