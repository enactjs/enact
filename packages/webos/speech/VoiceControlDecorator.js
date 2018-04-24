import React from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';
import hoc from '@enact/core/hoc';

/**
 * Adds a callback for voice events
 *
 * @class VoiceControlDecorator
 * @memberof webos/speech
 * @hoc
 */
const VoiceControlDecorator = hoc((config, Wrapped) => {
	return class extends React.Component {
		static displayName = 'VoiceControlDecorator'

		static propTypes = /** @lends webos/speech.VoiceControlDecorator.prototype */ {
			/**
			 * Callback to be executed when a wrapped element's `data-webos-voice-intent` is activated.
			 *
			 * @type {Function}
			 * @required
			 * @public
			 */
			onVoice: PropTypes.func.isRequired
		}

		componentDidMount () {
			this.node = findDOMNode(this);	// eslint-disable-line
			if (this.node && !(this.node.hasAttribute('data-webos-voice-event-target') || this.node.hasAttribute('data-webos-voice-intent'))) {
				this.node = this.node.querySelector('[data-webos-voice-event-target]') || this.node.querySelector('[data-webos-voice-intent]');
			}
			if (this.node) this.node.addEventListener('webOSVoice', this.props.onVoice);
		}

		componentWillUnmount () {
			if (this.node) this.node.removeEventListener('webOSVoice', this.props.onVoice);
		}

		render () {
			const props = {...this.props};
			delete props.onVoice;
			return (<Wrapped {...props} />);
		}
	};
});

export default VoiceControlDecorator;
export {VoiceControlDecorator};
