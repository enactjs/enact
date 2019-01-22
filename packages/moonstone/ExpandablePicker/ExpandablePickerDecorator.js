import hoc from '@enact/core/hoc';
import React from 'react';
import PropTypes from 'prop-types';

const ExpandablePickerDecorator = hoc((config, Wrapped) => {	// eslint-disable-line no-unused-vars

	return class extends React.Component {
		static displayName = 'ExpandablePickerDecorator'

		static propTypes = {
			open: PropTypes.bool,
			value: PropTypes.number
		}

		constructor (props) {
			super(props);

			this.state = {
				value: props.value,
				prevOpen: props.open
			};
		}

		static getDerivedStateFromProps (props, state) {
			if (state.prevOpen !== props.open && state.value !== props.value) {
				return {
					value: props.open ? props.value : state.value,
					prevOpen: props.open
				};
			}

			return null;
		}

		handlePick = (ev) => {
			this.setState({
				value: ev.value
			});
		}

		render () {
			const {value} = this.props.open ? this.state : this.props;

			return (
				<Wrapped {...this.props} onPick={this.handlePick} value={value} />
			);
		}
	};
});

export default ExpandablePickerDecorator;
export {ExpandablePickerDecorator};
