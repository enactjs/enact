import hoc from '@enact/core/hoc';
import {Spotlight, Spottable} from '@enact/spotlight';
import Pressable from '@enact/ui/Pressable';
import React from 'react';

const SpottablePicker = hoc(null, (config, Wrapped) => {
	const Joined = Pressable(Spottable(Wrapped));
	return class extends React.Component {
		static displayName = 'SpottablePicker'

		static propTypes = {
			joined: React.PropTypes.bool
		}

		componentDidUpdate () {
			if (this.incrementerNode.disabled && !this.decrementerNode.disabled) {
				Spotlight.focus(this.decrementerNode);
			} else if (this.decrementerNode.disabled && !this.incrementerNode.disabled) {
				Spotlight.focus(this.incrementerNode);
			}
		}

		getDecrementerNode = (node) => {
			this.decrementerNode = node;
		}

		getIncrementerNode = (node) => {
			this.incrementerNode = node;
		}

		render () {
			const Component = this.props.joined ? Joined : Wrapped;
			return <Component {...this.props} incrementerRef={this.getIncrementerNode} decrementerRef={this.getDecrementerNode} />;
		}
	};
});

export default SpottablePicker;
export {SpottablePicker};
