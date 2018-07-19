import hoc from '@enact/core/hoc';
import Spottable from '@enact/spotlight/Spottable';
import PropTypes from 'prop-types';
import React from 'react';

const SpottablePicker = hoc(null, (config, Wrapped) => {
	const Joined = Spottable(Wrapped);

	return class extends React.Component {
		static displayName = 'SpottablePicker'

		static propTypes = {
			joined: PropTypes.bool,
			onSpotlightDown: PropTypes.func,
			onSpotlightLeft: PropTypes.func,
			onSpotlightRight: PropTypes.func,
			onSpotlightUp: PropTypes.func
		}

		render () {
			const {onSpotlightDown, onSpotlightLeft, onSpotlightRight, onSpotlightUp, ...rest} = this.props;
			const Component = this.props.joined ? Joined : Wrapped;
			return (
				<Component
					{...rest}
					onPickerSpotlightDown={onSpotlightDown}
					onPickerSpotlightLeft={onSpotlightLeft}
					onPickerSpotlightRight={onSpotlightRight}
					onPickerSpotlightUp={onSpotlightUp}
				/>
			);
		}
	};
});

export default SpottablePicker;
export {
	SpottablePicker
};
