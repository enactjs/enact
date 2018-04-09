import React from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';

class VoiceControl extends React.Component {
	static propTypes = {
		onVoice: PropTypes.func.isRequired
	}

	componentDidMount () {
		this.node = findDOMNode(this);
		if (!(this.node.hasAttribute('data-voice-event-target') || this.node.hasAttribute('webos-voice-intent'))) {
			this.node = this.node.querySelector('[data-voice-event-target]') || this.node.querySelector('[webos-voice-intent]');
		}
		if (this.node) this.node.addEventListener('webOSVoice', this.props.onVoice);
	}

	componentWillUnmount () {
		if (this.node) this.node.removeEventListener('webOSVoice', this.props.onVoice);
	}

	render = () => (this.props.children)
}

export default VoiceControl;
