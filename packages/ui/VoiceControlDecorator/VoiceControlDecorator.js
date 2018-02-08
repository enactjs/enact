import hoc from '@enact/core/hoc';
import React from 'react';
import PropTypes from 'prop-types';
import {VoiceControl} from '@enact/webos/VoiceControl/VoiceControl';
import {forward} from '@enact/core/handle';

const defaultConfig = {
	voiceSlot: []
};

const VoiceControlDecorator = hoc(defaultConfig, (config, Wrapped) => {
	return class extends React.Component {
		static displayName = 'VoiceControlDecorator'

		static propTypes = {
			voiceDisabled: PropTypes.bool,
			voiceLabel: PropTypes.string,
			voiceSlot: PropTypes.array
		}

		static defaultProps = {
			voiceDisabled: false,
			voiceSlot: []
		}

		constructor (props) {
			super(props);
			this.voiceList = [];
		}

		componentWillReceiveProps (nextProps) {
			if (!this.props.voiceDisabled && nextProps.voiceDisabled) {
				this.removeVoiceControl();
			} else if (this.props.voiceDisabled && !nextProps.voiceDisabled) {
				this.addVoiceControl();
			}
		}

		componentDidMount () {
			if (!this.props.voiceDisabled) {
				this.addVoiceControl();
			}
		}

		componentWillUnmount () {
			if (!this.props.voiceDisabled) {
				this.removeVoiceControl();
			}
		}

		render () {
			const props = {...this.props};
			delete props.voiceDisabled;
			delete props.voiceLabel;
			delete props.voiceSlot;

			return (
				<Wrapped {...props} />
			);
		}

		addVoiceControl = () => {
			const voiceSlot = config.voiceSlot.concat(this.props.voiceSlot);

			if (voiceSlot.length > 0) {
				const list = [];
				for (let t in voiceSlot) {
					const {voiceIntent, voiceLabel, voiceHandler, voiceParams} = voiceSlot[t];
					const self = this;

					list.push({
						voiceIntent: voiceIntent,
						voiceLabel: voiceLabel || this.props.voiceLabel || this.props.children,
						onVoice: (e) => {
							const params = voiceParams || e;
							const type = typeof voiceHandler;

							if (type === 'string') {
								forward(voiceHandler, params, self.props);
							} else if (type === 'function') {
								voiceHandler(params, self.props);
							}
						}
					});
				}
				this.voiceList = VoiceControl.addList(list);
			}
		}

		removeVoiceControl = () => {
			if (this.voiceList.length > 0) {
				VoiceControl.removeList(this.voiceList);
			}
		}
	};
});

export default VoiceControlDecorator;
export {VoiceControlDecorator};
