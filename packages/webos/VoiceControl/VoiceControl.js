import React from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';

class VoiceControl extends React.Component {
	static propTypes = {
		onVoice: PropTypes.func.isRequired
	}

	componentDidMount () {
		findDOMNode(this).addEventListener('webOSVoice', this.props.onVoice);
	}

	componentWillUnmount () {
		findDOMNode(this).removeEventListener('webOSVoice', this.props.onVoice);
	}

	render = () => (this.props.children)
}

export default VoiceControl;
