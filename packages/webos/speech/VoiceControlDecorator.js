import React from 'react';
import PropTypes from 'prop-types';
import {findDOMNode} from 'react-dom';
import hoc from '@enact/core/hoc';

/**
 * VoiceControlDecorator is a higher-order component that adds a callback for voice event
 * to its wrapped component.
 *
 * By default, `onVoice` handler will be added to the node where `data-webos-voice-intent` attribute is declared.
 * In addition, if you need to specify a target node, `data-webos-voice-event-target` attribute can be used.
 *
 * Usage:
 * ```
 * import React from 'react';
 * import Item from '@enact/moonstone/Item';
 * import {VoiceControlDecorator} from '@enact/webos/speech';
 *
 * const VoiceDiv = VoiceControlDecorator('div');
 * const VoiceItem = VoiceControlDecorator(Item);
 *
 * class Sample extends React.Component {
 *   handlePlayListControl = (e) => {
 *     const {intent, control} = e.detail;
 *     // Change the app status refer to the `control` value.
 *   }
 *
 *   handlePlayContent = (e) => {
 *     const {intent, value} = e.detail;
 *     // Play content
 *   }
 *
 *   render () {
 *     return(
 *       <div>
 *         <VoiceDiv
 *           data-webos-voice-intent='PlayListControl'
 *           onVoice={this.handlePlayListControl}
 *         />
 *         <VoiceItem
 *           data-webos-voice-intent='Select PlayContent'
 *           onVoice={this.handlePlayContent}
 *         >
 *           The Dark Knight
 *         </VoiceItem>
 *       </div>
 *     );
 *   }
 * }
 * ```
 *
 * @class VoiceControlDecorator
 * @memberof webos/speech
 * @hoc
 * @public
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
export {
	VoiceControlDecorator
};
