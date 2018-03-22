import React from 'react';
import PropTypes from 'prop-types';

class VoiceControl extends React.Component {
	static propTypes = {
		voiceHandler: PropTypes.func.isRequired,
		voiceIntent: PropTypes.string.isRequired,
		voiceDisabled: PropTypes.bool,
		voiceLabel: PropTypes.string,
		voiceTitle: PropTypes.string
	}

	componentWillUnmount () {
		this.removeVoiceListener();
	}

	addVoiceListener = () => {
		if (this.node) this.node.addEventListener('onvoice', this.handleVoice);
	}

	removeVoiceListener = () => {
		if (this.node) this.node.removeEventListener('onvoice', this.handleVoice);
	}

	handleVoice = (e) => {
		if (this.props.voiceHandler) {
			this.props.voiceHandler(e.detail);
		}
	}

	getRef = (ref) => {
		this.node = ref;
		this.addVoiceListener();
	}

	render () {
		const {voiceDisabled, voiceIntent, voiceLabel, voiceTitle, ...props} = this.props;
		delete props.voiceHandler;

		return (
			<div
				ref={this.getRef}
				data-voice-disabled={voiceDisabled}
				data-voice-intent={voiceIntent}
				data-voice-label={voiceLabel}
				data-voice-title={voiceTitle}
				{...props}
			/>
		);
	}
}

export default VoiceControl;
