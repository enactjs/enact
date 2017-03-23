import hoc from '@enact/core/hoc';
import Spottable from '@enact/spotlight/Spottable';
import Pressable from '@enact/ui/Pressable';
import React from 'react';

const SpottablePicker = hoc(null, (config, Wrapped) => {
	const Joined = Pressable(Spottable(Wrapped));
	return class extends React.Component {
		static displayName = 'SpottablePicker'

		static propTypes = {
			joined: React.PropTypes.bool
		}

		render () {
			const Component = this.props.joined ? Joined : Wrapped;
			return <Component {...this.props} />;
		}
	};
});

export default SpottablePicker;
export {SpottablePicker};
