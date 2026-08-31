import hoc from '@enact/core/hoc';
import {WithRef} from '@enact/core/internal/WithRef';
import {checkPropTypes} from '@enact/core/util';
import {Component, createRef, type RefObject} from 'react';
import PropTypes from 'prop-types';

type VoiceControlDecoratorProps = {
	onVoice: EventListener;
	[prop: string]: any;
};

/**
 * VoiceControlDecorator is a higher-order component that adds a callback for voice event
 * to its wrapped component.
 *
 * By default, `onVoice` handler will be added to the node where `data-webos-voice-intent` attribute is declared.
 * In addition, if you need to specify a target node, `data-webos-voice-event-target` attribute can be used.
 *
 * Usage:
 * ```
 * import {Component} from 'react';
 * import Item from '@enact/moonstone/Item';
 * import {VoiceControlDecorator} from '@enact/webos/speech';
 *
 * const VoiceDiv = VoiceControlDecorator('div');
 * const VoiceItem = VoiceControlDecorator(Item);
 *
 * class Sample extends Component {
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
	const WithRefComponent = WithRef(Wrapped);

	return class extends Component<VoiceControlDecoratorProps> {
		static displayName = 'VoiceControlDecorator';

		static propTypes = /** @lends webos/speech.VoiceControlDecorator.prototype */ {
			/**
			 * Callback to be executed when a wrapped element's `data-webos-voice-intent` is activated.
			 *
			 * @type {Function}
			 * @required
			 * @public
			 */
			onVoice: PropTypes.func.isRequired
		};

		constructor (props: VoiceControlDecoratorProps) {
			super(props);
			checkPropTypes(this, props);
		}

		componentDidMount () {
			this.node = this.nodeRef.current;
			if (this.node && !(this.node.hasAttribute('data-webos-voice-event-target') || this.node.hasAttribute('data-webos-voice-intent'))) {
				this.node = this.node.querySelector('[data-webos-voice-event-target]') || this.node.querySelector('[data-webos-voice-intent]');
			}
			if (this.node) this.node.addEventListener('webOSVoice', this.props.onVoice);
		}

		componentDidUpdate (prevProps: VoiceControlDecoratorProps) {
			checkPropTypes(this, this.props, prevProps);
		}

		componentWillUnmount () {
			if (this.node) this.node.removeEventListener('webOSVoice', this.props.onVoice);
		}

		node: Element | null = null;
		nodeRef: RefObject<any> = createRef();

		render () {
			const props: Partial<VoiceControlDecoratorProps> = {...this.props};
			delete props.onVoice;

			return (
				<WithRefComponent {...props} outermostRef={this.nodeRef} referrerName="VoiceControlDecorator" />
			);
		}
	};
});

export default VoiceControlDecorator;
export {
	VoiceControlDecorator
};
