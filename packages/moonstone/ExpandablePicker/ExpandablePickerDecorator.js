import {forward, handle} from '@enact/core/handle';
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
				value: props.value
			};
		}

		handle = handle.bind(this);

		handleOpen = this.handle(
			forward('onOpen'),
			(ev, {value}) => this.setState(state => state.value === value ? null : {value})
		);

		handlePick = (ev) => {
			this.setState({
				value: ev.value
			});
		}

		render () {
			const {value} = this.props.open ? this.state : this.props;

			return (
				<Wrapped {...this.props} onOpen={this.handleOpen} onPick={this.handlePick} value={value} />
			);
		}
	};
});

export default ExpandablePickerDecorator;
export {ExpandablePickerDecorator};
